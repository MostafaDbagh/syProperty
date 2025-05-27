import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <div className="section-dream-home tf-spacing-7">
      <div className="tf-container xl">
        <div className="row">
          <div className="col-12">
            <div className="box-dream-home">
              <div className="left scroll-effect">
                <div className="text-display-4 text_white title text-change-color">
                  Find the home that best fits your finances
                </div>
                <p
                  className="text-1 text-color1 description wow animate__fadeInUp animate__animated"
                  data-wow-delay="0.3s"
                >
                  At Proty, we're more than just a real estate company; we're
                  architects of dreams, crafting spaces where life flourishes
                  and businesses thrive. With a rich history spanning 12 years,
                  we've established ourselves as a trusted leader in the real
                  estate market, renowned for our unwavering commitment to
                  excellence, innovation, and client satisfaction.
                </p>
                <div
                  className="wrap-contact-item wow animate__fadeInUp animate__animated"
                  data-wow-delay="0.3s"
                >
                  <div className="contact-item">
                    <div className="icons">
                      <i className="icon-phone-2" />
                    </div>
                    <div className="content">
                      <div className="title text-1">Call us</div>
                      <h6>
                        <a href="#"> (603) 555-0123</a>
                      </h6>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="icons">
                      <i className="icon-letter-2" />
                    </div>
                    <div className="content">
                      <div className="title text-1">Nee live help</div>
                      <h6 className="fw-4">
                        <a href="#"> proty-support@gmail.com </a>
                      </h6>
                    </div>
                  </div>
                </div>
                <a
                  className="tf-btn bg-color-primary pd-25 rounded-cycle height-1 wow animate__fadeInUp animate__animated"
                  data-wow-delay="0.3s"
                >
                  More about <i className="icon-arrow-right-3" />
                </a>
              </div>
              <div className="center xl-hide">
                <div className="img-style img-custom-anim-left">
                  <Image
                    className="lazyload parallax-img"
                    data-src="/images/section/section-find-home-2.jpg"
                    alt=""
                    width={620}
                    height={816}
                    src="/images/section/section-find-home-2.jpg"
                  />
                </div>
              </div>
              <div className="right">
                <div className="content">
                  <div className="text-11 text_white fw-6 title wow animate__fadeInUp animate__animated">
                    Our Expertise:
                  </div>
                  <p className="text-color1 text-1 description wow animate__fadeInUp animate__animated">
                    We offer a comprehensive suite of real estate services,
                    catering to a diverse clientele with varied needs and
                    aspirations. Our core areas of expertise include:
                  </p>
                  <ul className="list-check">
                    <li className="text-1 text-color1 wow animate__fadeInUp animate__animated">
                      <i className="icon-check-cycle" />
                      Residential Sales and Leasing
                    </li>
                    <li
                      className="text-1 text-color1 wow animate__fadeInUp animate__animated"
                      data-wow-delay="0.2s"
                    >
                      <i className="icon-check-cycle" />
                      Commercial Real Estate
                    </li>
                    <li
                      className="text-1 text-color1 wow animate__fadeInUp animate__animated"
                      data-wow-delay="0.3s"
                    >
                      <i className="icon-check-cycle" />
                      Property Management
                    </li>
                    <li
                      className="text-1 text-color1 wow animate__fadeInUp animate__animated"
                      data-wow-delay="0.4s"
                    >
                      <i className="icon-check-cycle" />
                      Investment Advisory
                    </li>
                  </ul>
                </div>
                <div className="img-style">
                  <Image
                    className="lazyload parallax-img img-custom-anim-left"
                    data-src="/images/section/section-find-home.jpg"
                    alt=""
                    width={552}
                    height={319}
                    src="/images/section/section-find-home.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
