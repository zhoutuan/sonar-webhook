var express = require('express');
var router = express.Router();
let DingTalk = require('../utils/dingtalk');
let request = require('request-promise');
let config = require('../config.json');

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log(config);
  console.log(req.query);
  if ((req.query.access_token || '') == '') {
    res.end('access_token不能为空');
  } else {
    let message = `Bug数量：12个，漏洞数量：32个，异味数量：2个，覆盖率：3个, 请及时修复`;
    let dingtalk = new DingTalk('https://oapi.dingtalk.com/robot/send?access_token=' + req.query.access_token);
    let pic_url = 'http://s1.ax1x.com/2020/10/29/BGMZwD.png';
    let message_url = `${config.sonar.url}/dashboard`;
    dingtalk.sendLink('【测试项目-测试分支】代码质量报告', message, message_url, pic_url)
    res.end('get /sonar');
  }
});

router.post('/', async (req, res, next) => {
  console.log(req.body);
  if ((req.query.access_token || '') == '') {
    res.end('access_token不能为空');
  } else {
    let sonar_url = `${config.sonar.url.internal}/api/measures/component?branch=${req.body.branch.name}&component=${req.body.project.key}&metricKeys=alert_status,bugs,reliability_rating,vulnerabilities,security_rating,code_smells,sqale_rating,duplicated_lines_density,coverage,ncloc,ncloc_language_distribution`;
    console.log(sonar_url);
    var token = (new Buffer(`${config.sonar.account.username}:${config.sonar.account.password}`)).toString('base64');
    let options = {
      method: "GET",
      uri: sonar_url,
      headers: {
        'Authorization': 'Basic ' + token
      },
      json: true
    }
    request(options).then(res => {
      return res;
    }).then(res => {
      console.log(res);
      res = res.component.measures;
      if(res) {
        //bug数量
        let bugs = res.find(s => s.metric == 'bugs').value;
        //漏洞数量
        let vulnerabilities = res.find(s => s.metric == 'vulnerabilities').value;
        // 警告数量
        let code_smells = res.find(s => s.metric == 'code_smells').value;
        // 覆盖率
        let coverage = res.find(s => s.metric == 'coverage').value;
        // 重复率
        let duplicated_lines_density = res.find(s => s.metric == 'duplicated_lines_density').value;
        // 项目名称
        let project_name = req.body.project.name;
        // 项目分支
        let branch = req.body.branch.name;
        // 状态
        let status = res.find(s => s.metric == 'alert_status').value;
        let message = `Bug数量：${bugs}个，漏洞数量：${vulnerabilities}个，异味数量：${code_smells}个，覆盖率：${coverage}个，重复率:${duplicated_lines_density}%，请及时修复`;
        let dingtalk = new DingTalk('https://oapi.dingtalk.com/robot/send?access_token=' + req.query.access_token);
        let pic_url = 'http://s1.ax1x.com/2020/10/29/BGMeTe.png';
        let message_url = `${config.sonar.url.external}/dashboard?id=${req.body.project.key}`;
        if (status == 'error') {
          pic_url = 'http://s1.ax1x.com/2020/10/29/BGMZwD.png';
        }
        dingtalk.sendLink(`【${project_name}-${branch}】代码质量诊断报告`, message, message_url, pic_url);
      } else {
        console.error(`获取诊断数据失败`);
      }
    }).catch(err => {
      console.error(err);
    });
    res.end('post /sonar');
  }
});

module.exports = router;