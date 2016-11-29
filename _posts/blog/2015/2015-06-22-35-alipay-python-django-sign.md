---
title: 支付宝移动支付python/django服务端签名
layout: blog
categories: blog
tags: python alipay
blogId: 35
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

支付宝移动支付，官方只提供了PHP示例，其他语言需要自己写。（汗，大阿里真是省事啊）

<span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif; line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);">博主使用了python/django开发个服务器。</span>

> <span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif; line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);">需求：移动端通过服务端API获取签名然后支付，即签名在服务端处理，客户端不保存。</span>

<span style="color:#333333;font-family:Helvetica Neue, Helvetica, Segoe UI, Arial, freesans, sans-serif"><span style="line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);">1、需要使用RSA加密</span></span>

<pre class="brush:python;toolbar:false">import rsa #需要这个库</pre>

2、几个重要的参数，作为初始化

<pre class="brush:python;toolbar:false">class Alipay(object):
    ## default value
    service = "mobile.securitypay.pay"# api name, default value
    _input_charset = "utf-8"
    sign_type = "RSA"# only support RSA
    payment_type = 1

    # get value from settings.py
    # partner id, len=16 (2088...)
    partner = getattr(settings, "ALIPAY_PARTNER", None)
    notify_url = getattr(settings, "ALIPAY_NOTIFY_URL", None)
    # the account id of seller (email or phone or partner id)
    seller_id = getattr(settings, "ALIPAY_SELLER_ID", None)

    print partner, notify_url, seller_id

    def __init__(self, out_trade_no, subject, body, total_fee):
        # unique value, max=64
        self.out_trade_no = out_trade_no
        # order title/ trade keys, max=128
        self.subject = subject
        # the detail info of order, max=512
        self.body = body
        # the total pay fee
        self.total_fee = total_fee</pre>

<span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif; line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);">
</span>

<span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif; line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);">3、本地密匙pem文件的读取（文件与py同级）</span>

<pre class="brush:python;toolbar:false">path = os.path.dirname(__file__)
priv_path = os.path.abspath(os.path.join(path, "rsa_private_key.pem"))
pub_path_ali = os.path.abspath(os.path.join(path, "rsa_public_key_ali.pem"))

pem = open(priv_path, "r").read()
_private_rsa_key = rsa.PrivateKey.load_pkcs1(pem)

pem = open(pub_path_ali, "r").read()
_public_rsa_key_ali = rsa.PublicKey.load_pkcs1_openssl_pem(pem)</pre>

<span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif; line-height: 25.6000003814697px; background-color: rgb(255, 255, 255);"></span>

4、签名create_pay_url获取签名内容和签名结果（只添加了必须得数据）

<pre class="brush:python;toolbar:false">    def _build_sign_url(self):
        url = ""
        # static value
        url = url + 'service="%s"' % self.service
        url = url + '&_input_charset="%s"' % self._input_charset
        url = url + '&payment_type="%d"' % self.payment_type
        url = url + '&partner="%s"' % self.partner
        url = url + '&notify_url="%s"' % self.notify_url
        url = url + '&seller_id="%s"' % self.seller_id
        # init value
        url = url + '&out_trade_no="%s"' % self.out_trade_no
        url = url + '&subject="%s"' % self.subject
        url = url + '&body="%s"' % self.body
        url = url + '&total_fee="%0.2f"' % self.total_fee
        # optional value
        if hasattr(self, "it_b_pay"):
            url = url + '&it_b_pay="%s"' % self.it_b_pay

        return url

    def _create_sign(self, content):
        content = content.encode(self._input_charset)
        sign = rsa.sign(content, _private_rsa_key, "SHA-1")
        sign = base64.encodestring(sign).replace("\n", "")
        return 'sign="%s"&sign_type="%s"' % (quote(sign), self.sign_type)

    def create_pay_url(self):
        content = self._build_sign_url()
        sign_url = self._create_sign(content)
        return "%s&%s" % (content, sign_url)</pre>

5、验证支付成功后支付宝通知（需要按照字母排序）

<pre class="brush:python;toolbar:false">def notify_sign_value(request, content, key):
    if key in request.POST:
        value = request.POST[key]
        print "key: ", key, "value: ", value
        return "&%s=%s"%(key, value)
    else:
        return ""

def check_notify_sign(request):
    """
    按照字母顺序排序，然后使用阿里云的公匙验证。
    """
    content = ""
    post_list = sorted(request.POST.iteritems(), key=lambda d:d[0], reverse=False)
    for key_value in post_list:
        if key_value[0] not in ["sign", "sign_type"]:
            content = "%s&%s=%s"%(content, key_value[0], key_value[1])

    #remove the first &
    content = content[1:]
    content = content.encode("utf-8")
    try:
        sign = request.POST["sign"]
        sign = base64.decodestring(sign)
        rsa.verify(content, sign, _public_rsa_key_ali)
        return True
    except Exception,e:
        print "check_notify_sign error", e
        return False</pre>

6、使用方法及源码可参照github

第一个开源代码![](http://img.baidu.com/hi/jx2/j_0006.gif)

github地址：[https://github.com/0kai/alipay-python-rsa](https://github.com/0kai/alipay-python-rsa)