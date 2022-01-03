import { useSession, signIn } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import style from './style.module.scss'

interface SubscribeButtonProps {
    priceId: String
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { status } = useSession()
    async function handlreSubscribe() {
        if (status !== 'authenticated') {
            signIn('github')
            return
        }
        try {
            const response = await api.post('subscribe')

            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId: sessionId })
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <button
            type="button"
            className={style.subscribeButton}
            onClick={handlreSubscribe}
        >
            Subscribe
        </button>
    )
}