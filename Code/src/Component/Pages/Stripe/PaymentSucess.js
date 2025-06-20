import React from 'react'

export default function PaymentSucess() {
  return (
    <div className="container">
  <div className="row justify-content-center">
    <div className="col-md-5">
      <div className="message-box _success">
        <i className="fa fa-check-circle" aria-hidden="true" />
        <h2> Your payment was successful </h2>
        <p>
          {" "}
          Thank you for your payment. we will <br />
          be in contact with more details shortly{" "}
        </p>
      </div>
    </div>
  </div>
</div>

  )
}
