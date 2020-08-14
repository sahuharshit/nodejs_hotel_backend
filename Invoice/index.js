const puppeteer =require('puppeteer');
const models  = require('../models');
const crypto=require('crypto');
const hmac = crypto.createHmac('sha256','secret');
const fs = require('fs')
let data={};
//const { format } = require('sequelize/types/lib/utils');
const html=`
<html>
<head><meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<style type="text/css">
<!--
span.cls_003{font-family:"Century",serif;font-size:10.1px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_003{font-family:"Century",serif;font-size:10.1px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}
span.cls_005{font-family:"Century",serif;font-size:10.1px;color:rgb(64,64,65);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_005{font-family:"Century",serif;font-size:10.1px;color:rgb(64,64,65);font-weight:normal;font-style:normal;text-decoration: none}
span.cls_009{font-family:"Century",serif;font-size:7.0px;color:rgb(64,64,65);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_009{font-family:"Century",serif;font-size:7.0px;color:rgb(64,64,65);font-weight:normal;font-style:normal;text-decoration: none}
span.cls_006{font-family:"Century",serif;font-size:16.1px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_006{font-family:"Century",serif;font-size:16.1px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}
span.cls_008{font-family:"Century",serif;font-size:10.1px;color:rgb(0,0,2);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_008{font-family:"Century",serif;font-size:10.1px;color:rgb(0,0,2);font-weight:normal;font-style:normal;text-decoration: none}
span.cls_010{font-family:"Century",serif;font-size:11.1px;color:rgb(0,0,2);font-weight:normal;font-style:normal;text-decoration: none}
div.cls_010{font-family:"Century",serif;font-size:11.1px;color:rgb(0,0,2);font-weight:normal;font-style:normal;text-decoration: none}
-->
</style>
<script type="text/javascript" src="bbc9373c-dd47-11ea-8b25-0cc47a792c0a_id_bbc9373c-dd47-11ea-8b25-0cc47a792c0a_files/wz_jsgraphics.js"></script>
</head>
<body>
<div style="position:absolute;left:50%;margin-left:-297px;top:0px;width:595px;height:842px;border-style:outset;overflow:hidden">
<div style="position:absolute;left:0px;top:0px">
<img src="" width=595 height=842></div>
<div style="position:absolute;left:22.23px;top:95.36px" class="cls_003"><span class="cls_003">Address:</span></div>
<div style="position:absolute;left:22.23px;top:112.36px" class="cls_005"><span class="cls_005">Hotstores Solutions Sdn Bhd </span><span class="cls_009">784355 P</span></div>
<div style="position:absolute;left:22.23px;top:127.36px" class="cls_005"><span class="cls_005">No 61C, 2nd Floor, Changkat Thambi Dollah,</span></div>
<div style="position:absolute;left:22.23px;top:142.36px" class="cls_005"><span class="cls_005">Off Jalan Pudu 55100, Kuala Lumpur, Malaysia .</span></div>
<div style="position:absolute;left:22.23px;top:171.36px" class="cls_003"><span class="cls_003">Telephone:</span></div>
<div style="position:absolute;left:84.63px;top:171.36px" class="cls_005"><span class="cls_005">+603 2141 7829</span></div>
<div style="position:absolute;left:445.30px;top:171.43px" class="cls_003"><span class="cls_003">Booking No:</span></div>
<div style="position:absolute;left:511.78px;top:171.43px" class="cls_005"><span class="cls_005">468111111t</span></div>
<div style="position:absolute;left:422.05px;top:188.43px" class="cls_003"><span class="cls_003">Credit Date:</span></div>
<div style="position:absolute;left:489.93px;top:188.43px" class="cls_005"><span class="cls_005">31 August, 2020</span></div>
<div style="position:absolute;left:21.13px;top:231.35px" class="cls_006"><span class="cls_006">Receipt</span></div>
<div style="position:absolute;left:38.50px;top:283.36px" class="cls_005"><span class="cls_005">Name</span></div>
<div style="position:absolute;left:122.00px;top:283.36px" class="cls_003"><span class="cls_003">:</span></div>
<div style="position:absolute;left:38.50px;top:307.36px" class="cls_005"><span class="cls_005">Billing Address</span></div>
<div style="position:absolute;left:122.00px;top:307.36px" class="cls_003"><span class="cls_003">:</span></div>
<div style="position:absolute;left:38.50px;top:331.36px" class="cls_005"><span class="cls_005">Email Address</span></div>
<div style="position:absolute;left:122.00px;top:331.36px" class="cls_003"><span class="cls_003">:</span></div>
<div style="position:absolute;left:40.50px;top:393.36px" class="cls_008"><span class="cls_008">Hotel Name</span></div>
<div style="position:absolute;left:153.38px;top:393.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:393.36px" class="cls_008"><span class="cls_008">TEXT TEXT TEXT TEXT TEXT</span></div>
<div style="position:absolute;left:40.50px;top:417.36px" class="cls_008"><span class="cls_008">Period</span></div>
<div style="position:absolute;left:153.38px;top:417.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:417.36px" class="cls_008"><span class="cls_008">31 August,200 - 1 September, 2020 (1 night)</span></div>
<div style="position:absolute;left:40.50px;top:441.36px" class="cls_008"><span class="cls_008">Room Type</span></div>
<div style="position:absolute;left:153.38px;top:441.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:441.36px" class="cls_008"><span class="cls_008">text text text</span></div>
<div style="position:absolute;left:40.50px;top:465.36px" class="cls_008"><span class="cls_008">Number of Rooms</span></div>
<div style="position:absolute;left:153.38px;top:465.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:465.36px" class="cls_008"><span class="cls_008">01</span></div>
<div style="position:absolute;left:40.50px;top:489.36px" class="cls_008"><span class="cls_008">Number of Extra Beds</span></div>
<div style="position:absolute;left:153.38px;top:489.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:489.36px" class="cls_008"><span class="cls_008">0</span></div>
<div style="position:absolute;left:40.50px;top:513.36px" class="cls_008"><span class="cls_008">Total Room Charge</span></div>
<div style="position:absolute;left:153.38px;top:513.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:513.36px" class="cls_008"><span class="cls_008">USD 150.00</span></div>
<div style="position:absolute;left:502.29px;top:519.36px" class="cls_008"><span class="cls_008">USD 150.00</span></div>
<div style="position:absolute;left:40.50px;top:537.36px" class="cls_008"><span class="cls_008">Total Extra Bed Charge:</span></div>
<div style="position:absolute;left:176.76px;top:537.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:513.37px;top:543.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:40.50px;top:561.36px" class="cls_008"><span class="cls_008">Other</span></div>
<div style="position:absolute;left:153.38px;top:561.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:561.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:513.37px;top:567.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:40.50px;top:585.36px" class="cls_008"><span class="cls_008">Discount</span></div>
<div style="position:absolute;left:153.38px;top:585.36px" class="cls_008"><span class="cls_008">:</span></div>
<div style="position:absolute;left:176.76px;top:585.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:513.37px;top:591.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:342.48px;top:617.86px" class="cls_008"><span class="cls_008">GRAND TOTAL</span></div>
<div style="position:absolute;left:513.37px;top:615.36px" class="cls_008"><span class="cls_008">USD 0.00</span></div>
<div style="position:absolute;left:275.47px;top:643.61px" class="cls_008"><span class="cls_008">Total Charge to Credit Card</span></div>
<div style="position:absolute;left:430.01px;top:643.35px" class="cls_010"><span class="cls_010">MYR 680.00 (USD 150.00)</span></div>
<div style="position:absolute;left:21.50px;top:801.86px" class="cls_005"><span class="cls_005">This receipt is automatically generated.</span></div>
</div>

</body>
</html>


`
const main=async(refNo)=>{
    try{
    
    const browser =await puppeteer.launch();
    const page= await browser.newPage();
    await page.setContent(html);
    // const base = './public/';
    // hmac.update(base+refNo)
    // const filename=hmac.digest('hex')+'.pdf';
    // fs.access(base+filename, fs.F_OK, async(err) => {
    //     if (err) {
    //       console.error(err)
    //       return filename;
    //     }
    //     else{
    //     console.log(filename);
    //     await page.pdf({path:base+filename,format:'A4'});
    //     await browser.close();
         
    //     return filename;
    //     }
    //     //file exists
    //   })
    // console.log(filename);
    let pdf =await page.pdf({format:'A4'});
    await browser.close();
     
    return pdf;
    }
    catch(e){
        return e;
    }
}

module.exports=main;