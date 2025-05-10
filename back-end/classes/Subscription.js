class Subscription {
    constructor() {

        this.RETURN_URL="http://localhost:7000/api/user/subscribe/succeed"
        this.CANCEL_URL="http://localhost:7000/subscription/payPalCancelPayment"
        this.AUTH = Buffer.from(process.env.CLIENT_ID + ':' + process.env.SECRET).toString('base64');

        this.SUBSCRIBTION_PAY_LOAD = {
            "plan_id": process.env.SUBSCRIBE_PLAN_ID,
            "application_context": {
                "brand_name": "Subscription.js Plan",
                "locale": "en-US",
                "user_action": "SUBSCRIBE_NOW",
                "payment_method": {
                    "payer_selected": "PAYPAL",
                    "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
                },
                "return_url": this.RETURN_URL,
                "cancel_url": this.CANCEL_URL
            }
        }
    }

    async subscribeRequest(){
        return await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
            method: 'post',
            body: JSON.stringify(this.SUBSCRIBTION_PAY_LOAD),
            headers: {
                'Authorization': 'Basic ' + this.AUTH,
                'Content-Type': 'application/json'
            },
        });
    }

    async isSubscriptionIsValid(user) {
        const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${user.subscriptionId}`, {
            method: 'get',
            headers: {
                'Authorization': 'Basic ' + this.AUTH,
                'Content-Type': 'application/json'
            },
        });
        const subscriptionDetails = await response.json();
        return subscriptionDetails.status === 'ACTIVE';
    }
}

module.exports = new Subscription();