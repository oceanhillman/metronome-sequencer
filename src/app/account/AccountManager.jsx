import { Button } from "react-bootstrap"
export default function AccountManager() {

    return (
        <div className="bg-muted-blue">
            <Button href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL} variant="primary" size="lg" className="!bg-persian-pink !text-chinese-black !font-medium !border-none">Manage Subscription</Button>
        </div>
    )
}