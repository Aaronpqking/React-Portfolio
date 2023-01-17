import React from 'react'
// import ReactDOM from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const element = <FontAwesomeIcon icon={faCoffee} />
const socialMediaLogos = {
  gitHubLink: "https://github.com/aaronpqking",

}

// ReactDOM.render(element, document.body)

export default function Footer() {
  return (
    <div>
<div>

<div className="jumbotron bg-primary">
  <div className="position-relative"></div>
  {/* <p className="display-3 m-center"></p> */}
          
{/* 
<FontAwesomeIcon icon={['fab', 'twitter']} /> */}

          <a href="https://linkedin/in/aaronpqking">
<FontAwesomeIcon icon={['fab', 'linkedin']} />
          </a>
          <a className="card-text" href={socialMediaLogos.gitHubLink}>
                <i id="github-logo-footer"className="fa fa-github"></i>
              </a>

  <p className="lead m-center"></p>
  <p id="date" className="lead date"></p>
</div>


</div>
    </div>
  )
}
