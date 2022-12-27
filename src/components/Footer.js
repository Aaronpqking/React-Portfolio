import React from 'react'
// import ReactDOM from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const element = <FontAwesomeIcon icon={faCoffee} />

// ReactDOM.render(element, document.body)

export default function Footer() {
  return (
    <div>


<div className="jumbotron bg-primary">
  <div className="position-relative"></div>
  {/* <p className="display-3 m-center"></p> */}
          
{/* 
<FontAwesomeIcon icon={['fab', 'twitter']} /> */}

          <button href="https://linkedin/in/aaronpqking">
<FontAwesomeIcon icon={['fab', 'linkedin']} />
          </button>
          <button href="https://github.com/Aaronpqking"g>
          <FontAwesomeIcon  icon={['fab', 'github']} />          
          </button>    


  <p className="lead m-center"></p>
  <p id="date" className="lead date"></p>
</div>



    </div>
  )
}
