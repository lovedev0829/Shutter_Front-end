import React from 'react'
import Header from '../../../Layout/header'
import TableTitle from '../../Form/TableTitle'
import { Link } from 'react-router-dom'

export default function ViewCutSheet() {
  return (
    <div className="intersight_content">
     <Header title="Cut Sheet" />
     <div className="body_content">
    <div className="contact-profile">
    <div className="d-flex align-items-center justify-content-between mb-30">
      <TableTitle title="Generate Cut Sheet" />
     </div>
     <div className="form-design window-form-design mb-2">
            <div className="row">
              <div className="col-lg-3 col-md-3">
                <div className="form-group">
                  <label className="font-14">Select Customer</label>
                  <select
                    className="form-select "
                    aria-label="Default select example"
                  >
                    <option selected="">Choose Customer</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-3 col-md-3">
                <div className="form-group">
                  <label className="font-14">Select Window</label>
                  <select
                    className="form-select "
                    aria-label="Default select example"
                  >
                    <option selected="">Choost Window</option>
                    <option value={1}>One</option>
                    <option value={2}>Two</option>
                    <option value={3}>Three</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 d-flex align-items-end">
                <div className="form-group w-100">
                  <input
                    type="text"
                    className="form-control input-with-bg"
                    placeholder="Enter notes..."
                    defaultValue="Bi-Fold Shutter"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="panel-section">
            <div className="row g-3">
              <div className="col-md-6 col-lg-6">
                <div className="panel-card">
                  <div className="panel-head d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3">
                      <h3 className="mb-0">Panel 1 Left</h3>
                      <img src="/image/editblue.svg" alt="" loading="lazy" style={{cursor:"pointer"}}/>
                    </div>
                    <p className="font-14">
                      QTY : <strong className="text-dark">2</strong>
                    </p>
                  </div>
                  <div className="pannel-content">
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Product Type</p>
                      <h3 className="font-14 mb-0">Tri-Fold Shutter</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Width</p>
                      <h3 className="font-14 mb-0">1</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Height</p>
                      <h3 className="font-14 mb-0">2</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Side Rail Qty</p>
                      <h3 className="font-14 mb-0">3</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Finished Height</p>
                      <h3 className="font-14 mb-0">4</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Top / Bottom Rail Width</p>
                      <h3 className="font-14 mb-0">5</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Count</p>
                      <h3 className="font-14 mb-0">6</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Width</p>
                      <h3 className="font-14 mb-0">7</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6">
                <div className="panel-card">
                  <div className="panel-head d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3">
                      <h3 className="mb-0">Panel 1 Right</h3>
                      <img src="/image/editblue.svg" alt="" loading="lazy" style={{cursor:"pointer"}}/>
                    </div>
                    <p className="font-14">
                      QTY : <strong className="text-dark">2</strong>
                    </p>
                  </div>
                  <div className="pannel-content">
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Product Type</p>
                      <h3 className="font-14 mb-0">Tri-Fold Shutter</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Width</p>
                      <h3 className="font-14 mb-0">1</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Height</p>
                      <h3 className="font-14 mb-0">2</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Side Rail Qty</p>
                      <h3 className="font-14 mb-0">3</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Finished Height</p>
                      <h3 className="font-14 mb-0">4</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Top / Bottom Rail Width</p>
                      <h3 className="font-14 mb-0">5</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Count</p>
                      <h3 className="font-14 mb-0">6</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Width</p>
                      <h3 className="font-14 mb-0">7</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 mb-3">
                <div className="panel-card">
                  <div className="panel-head d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3">
                      <h3 className="mb-0">Panel 2 Left</h3>
                      <img src="/image/editblue.svg" loading="lazy" alt="" style={{cursor:"pointer"}}/>
                    </div>
                    <p className="font-14">
                      QTY : <strong className="text-dark">2</strong>
                    </p>
                  </div>
                  <div className="pannel-content">
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Product Type</p>
                      <h3 className="font-14 mb-0">Tri-Fold Shutter</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Width</p>
                      <h3 className="font-14 mb-0">1</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Height</p>
                      <h3 className="font-14 mb-0">2</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Side Rail Qty</p>
                      <h3 className="font-14 mb-0">3</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Finished Height</p>
                      <h3 className="font-14 mb-0">4</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Top / Bottom Rail Width</p>
                      <h3 className="font-14 mb-0">5</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Count</p>
                      <h3 className="font-14 mb-0">6</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Width</p>
                      <h3 className="font-14 mb-0">7</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 mb-3">
                <div className="panel-card">
                  <div className="panel-head d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3">
                      <h3 className="mb-0">Panel 2 Right</h3>
                      <img src="/image/editblue.svg" alt="" loading="lazy" style={{cursor:"pointer"}}/>
                    </div>
                    <p className="font-14">
                      QTY : <strong className="text-dark">2</strong>
                    </p>
                  </div>
                  <div className="pannel-content">
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Product Type</p>
                      <h3 className="font-14 mb-0">Tri-Fold Shutter</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Width</p>
                      <h3 className="font-14 mb-0">1</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Window Height</p>
                      <h3 className="font-14 mb-0">2</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Side Rail Qty</p>
                      <h3 className="font-14 mb-0">3</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Finished Height</p>
                      <h3 className="font-14 mb-0">4</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Top / Bottom Rail Width</p>
                      <h3 className="font-14 mb-0">5</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Count</p>
                      <h3 className="font-14 mb-0">6</h3>
                    </div>
                    <div className="pannel-inner-content d-flex align-items-center justify-content-between">
                      <p className="mb-0">Blade Width</p>
                      <h3 className="font-14 mb-0">7</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-style form-group d-flex align-items-center justify-content-end gap-3 w-100 mt-3 mb-3">
            {/* <Link to="#" className="btn blue-btn btn-print">
            <span className="me-2">
              <img src="/image/print.png" alt="" loading="lazy"/>
            </span>
            Print
            </Link> */}
            <Link to="#" className="btn blue-btn">
              Save
            </Link>
            <Link to="#" className="cancel text-decoration-underline m-0 ms-3">
              Clear
            </Link>
          </div>
    </div>
    </div>
    </div>
  )
}
