import {query as q} from 'faunadb'


import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction: boolean,
){
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_customer_id'),
                    subscriptionId
                )
            )
        )
    )

    const subscription = await stripe.subscriptionItems.retrieve(subscriptionId)

    const subscriptionData = {
        id:subscription.id,
        userid: userRef,
        status: subscription.lastResponse.statusCode,
        price_id: subscription.price.id,
    }


    if(createAction){
        await fauna.query(
            q.Create(
                q.Collection('subscription'),
                {data: subscriptionData}
            )
        )
    }else {
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscription,
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}