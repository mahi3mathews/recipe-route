import logging
import os
from pathlib import Path

import stripe
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

stripe_key = os.getenv("STRIPE_API_KEY")
stripe.api_key = stripe_key
endpoint_key = os.getenv("STRIPE_WEBHOOK_KEY")


class PaymentService:
    def __init__(self, amount, email):
        self.__amount = int(amount)
        self.__currency = 'gbp'
        self.__receipt_email = email
        self.__stripe = stripe

    def setup_stripe(self):
        try:
            stripe_intent = self.__stripe.PaymentIntent.create(amount=self.__amount, currency=self.__currency,
                                                               automatic_payment_methods={'enabled': True},
                                                               receipt_email=self.__receipt_email)
            if "client_secret" in stripe_intent:
                return {"response": {"message": "Successfully setup stripe environment", "data": stripe_intent[
                    'client_secret'], "status": 'success'}, "code": 200}
        except Exception as ex:
            logging.warning(f"EXCEPTION => {ex} ")
            return {"response": {"message": "Failed to setup stripe environment", "status": 'fail'}, "code": 500}

    @staticmethod
    def stripe_payment_hook(payload, header):
        event = None
        res = {}
        try:
            event = stripe.Webhook.construct_event(
                payload, header, endpoint_key
            )
        except ValueError as e:
            res.update({'message': "Invalid payload", 'status': 'fail'})
            code = 400
        except stripe.error.SignatureVerificationError as e:
            res.update({'message': "Invalid signature", 'status': 'fail'})
            code = 400
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            # line_items = stripe.checkout.Session.list_line_items(session['id'], limit=1)



