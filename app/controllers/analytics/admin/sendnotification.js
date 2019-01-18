var {NotificationTokens} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');
var {Expo} = require('expo-server-sdk');

var expo = new Expo();
var receiptIds = [];

module.exports = {
    sendNotification: async (req, res,next) => {
      // if(req.bode.event ===null){
        var pushTokens  =await getManyDataWithPopulate(NotificationTokens,{},'participant','participant token','firstname lastname payment events');
      // console.log(pushTokens)
        var messages = [];
        for(i=0;i<pushTokens.length;i++)
        {
          if(req.body.event===null){
        messages.push({
            to: pushTokens[i].token,
            sound: 'default',
            // body: "Hello " + pushTokens[i].participant.firstname + " " +pushTokens[i].participant.lastname +", Your Payment is="+pushTokens[i].participant.payment,
            body: req.body.message,
            title:req.body.title,
            data: { withSome: 'body' },
          })} else {
            // console.log(pushTokens[i].participant.events.contains(req.body.event));
            
            // if(pushTokens[i].participant.events.includes(req.body.event)){
             let temp =  JSON.stringify(pushTokens[i].participant.events);
            if(temp.includes(req.body.event)){
              messages.push({
                to: pushTokens[i].token,
                sound: 'default',
                // body: "Hello " + pushTokens[i].participant.firstname + " " +pushTokens[i].participant.lastname +", Your Payment is="+pushTokens[i].participant.payment,
                body: req.body.message,
                title:req.body.title,
                data: { withSome: 'body' },
              })
            }
          }
        }
        // console.log(messages);

        var chunks = expo.chunkPushNotifications(messages);
        // console.log(chunks);
        
        var tickets = [];
       await (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
             
              tickets.push(ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        })();
        return res.json({status: true, tickets:tickets})
    },

    getReciepts: (req,res)=>{ 
        for (let ticket of tickets) {
          if (ticket.id) {
            receiptIds.push(ticket.id);
          }
        }
        
        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
          for (let chunk of receiptIdChunks) {
            try {
              let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
              console.log(receipts);
         for (let receipt of receipts) {
                if (receipt.status === 'ok') {
                  continue;
                } else if (receipt.status === 'error') {
                  console.error(`There was an error sending a notification: ${receipt.message}`);
                  if (receipt.details && receipt.details.error) {
                    console.error(`The error code is ${receipt.details.error}`);
                  }
                }
              }
            } catch (error) {
              console.error(error);
            }
          }
        })();

    }
  };
  
