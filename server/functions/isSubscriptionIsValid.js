const ApiError = require("../error/ApiError");


module.exports = async function(auth, user) {
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${user.subscriptionId}`, {
        method: 'get',
        headers: {
            'Authorization': 'Basic ' + auth,
            'Content-Type': 'application/json'
        },
    });
    const subscriptionDetails = await response.json();
    return subscriptionDetails.status === 'ACTIVE';
}