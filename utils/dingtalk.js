const Robot = require('dingding-robot-sdk');
// https://gitee.com/yunsin/dingding_robot_sdk 

let robot;

class DingTalk {

  /**
   * 
   * @param {*} url webhook的地址
   * @param {*} token token 可选
   */
  constructor(url, token = '') {
    robot = new Robot(url, token);
  }

  /**
   * 发送文本消息
   * @param {content: String, atMobiles: List<String>, isAtAll: Boolean} message 发送的消息体
   */
  async sendText (content, atMobiles, isAtAll) {
    let a = await robot.sendText({
      content,
      atMobiles,
      isAtAll
    });
    console.log(a);
  }

  /**
 * 发送链接消息
 * @param {title: String, text: String, messageUrl: String, picUrl: String} link 发送的消息体
 */
  sendLink (title, text, messageUrl, picUrl) {
    robot.sendLink({
      title,
      text,
      messageUrl,
      picUrl
    });
  }

  /**
 * 发送markdown消息
 * @param {title: String, text: String, atMobiles: List<String>, isAtAll: Boolean} markdownMessage markdown消息体
 */
  sendMarkdown (title, text, atMobiles, isAtAll) {
    robot.sendMarkdown({
      title,
      text,
      atMobiles,
      isAtAll
    });
  }

  /**
 * 发送行为卡片
 * @param {title: String, text: String, singleTitle: String, singleURL: String, btnOrientation: String, hideAvatar: String} markdownMessage 行为卡片消息体
 */
  sendActionCard (title, text, singleTitle, singleURL, btnOrientation, hideAvatar) {
    robot.sendActionCard({
      title,
      text,
      singleTitle,
      singleURL,
      btnOrientation,
      hideAvatar
    });
  }

  /**
 * 发送FeedCard
 * @param {List<{title: String, messageURL: String, picURL: String}>} links 发送的FeedCard链接
 */
  sendFeedCard (links) {
    robot.sendFeedCard(links);
  }
}

module.exports = DingTalk;