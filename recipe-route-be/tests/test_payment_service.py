import unittest
from unittest.mock import patch
from service.payment_service import PaymentService


class TestPaymentService(unittest.TestCase):

    def setUp(self):
        self.amount = 1000
        self.email = "test@example.com"
        self.payment_service = PaymentService(amount=self.amount, email=self.email)

    @patch("stripe.PaymentIntent.create")
    def test_setup_stripe_success(self, mock_payment_intent_create):
        mock_payment_intent_create.return_value = {
            "client_secret": "test_client_secret"
        }

        result = self.payment_service.setup_stripe()

        mock_payment_intent_create.assert_called_once_with(
            amount=self.amount,
            currency="gbp",
            automatic_payment_methods={'enabled': True},
            receipt_email=self.email
        )

        self.assertEqual(result["code"], 200)
        self.assertEqual(result["response"]["message"], "Successfully setup stripe environment")
        self.assertEqual(result["response"]["data"], "test_client_secret")
        self.assertEqual(result["response"]["status"], "success")

    @patch("stripe.PaymentIntent.create")
    def test_setup_stripe_failure(self, mock_payment_intent_create):
        mock_payment_intent_create.side_effect = Exception("Test exception")

        result = self.payment_service.setup_stripe()

        mock_payment_intent_create.assert_called_once_with(
            amount=self.amount,
            currency="gbp",
            automatic_payment_methods={'enabled': True},
            receipt_email=self.email
        )

        self.assertEqual(result["code"], 500)
        self.assertEqual(result["response"]["message"], "Failed to setup stripe environment")
        self.assertEqual(result["response"]["status"], "fail")


if __name__ == "__main__":
    unittest.main()
