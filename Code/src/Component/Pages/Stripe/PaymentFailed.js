import React from 'react'

export default function PaymentFailed() {
  return (
    <div className="row justify-content-center">
  <div className="col-md-5">
    <div className="message-box _success _failed">
      <i className="fa fa-times-circle" aria-hidden="true" />
      <h2> Your payment failed </h2>
      <p> Try again later </p>
    </div>
  </div>
</div>

  )
}
