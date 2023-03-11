import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { PATH } from "../../constants/API";

const StripeButton = ({ price, submitFunction }) => {
    const publishableKey = 'pk_test_51MjjSdGQIx2ANQKJh8YIgtX9JOgTatP3Lgc2lYY7yKKrEpUenadp1RHiG786r9Kwvv6C0VjNOx4usrULxaocg15u00jBpjbWrv'
    const stripePrice = price;

    const onToken = (token) => {
        console.log(token);
        console.log(price);

        axios.post(PATH.API_ROOT_URL + "/charge", {
            amount: stripePrice,
            stripeToken: token.id,
            currency: "VND"
        })
            .then((response) => {
                alert("Thanh toán thành công!")
                submitFunction()
            })
            .catch((error) => {
                alert("Xảy ra lỗi khi thanh toán!")
            })

    }

    return (
        <StripeCheckout className="btn btn-outline-primary-2 btn-order btn-block" amount={stripePrice}
            label="Thanh toán"
            description={"Thanh toán đơn hàng"}
            panelLabel="Thanh toán"
            token={onToken}
            stripeKey={publishableKey}
            currency="VND"
            locale="vi"
        />
    )
}
export default StripeButton