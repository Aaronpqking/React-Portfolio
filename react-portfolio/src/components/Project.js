import React from 'react'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import 'bootstrap/dist/css/bootstrap.min.css'
import realEstate from '../images/realEstate.png';
import weather from '../images/weather.png';

export default function Project() {
  return (
    <div className='body'>
  
    
    
  
<CardGroup style={{padding:30}}>
        <Card style={{ margin: 20}}>
          <a href="https://github.com/jmizis/Home-Page-Real-Estate" target="blank">
            <Card.Img variant="top" src={realEstate} alt="a link to a real Estate app using agile development" /></a>
        <Card.Body>
          <Card.Title>Real Estate Listings App</Card.Title>
          <Card.Text>
              A Real Estate listings app. Can be expanded to include tennant log in and communication, possibly rent payment. (Agile Development)
          </Card.Text>
        </Card.Body>
        </Card>
        
      <Card style={{margin: 20}}>
          
          <a href="https://aaronpqking.github.io/Weatherdashboard/" target="blank">
        <Card.Img variant="top" src={weather} /></a>
        <Card.Body>
          <Card.Title>Weather Dashboard</Card.Title>
          <Card.Text>
          A dynamically updated weather reporting site using 3rd party APIs
          </Card.Text>
        </Card.Body>
        </Card>
        
      <Card style={{margin:20}}>          
          <a href="https://aaronpqking.github.io/Javascript-Quiz-Game" target="blank">
          <Card.Img variant="top" src="javascriptQuiz.png" />
          </a>
        <Card.Body>
          <Card.Title>JavaScript Quiz</Card.Title>
          <Card.Text>
          A timed coding quiz with multiple-choice questions that features dynamically updated HTML and CSS powered by JavaScript
          </Card.Text>
        </Card.Body>
      </Card>
      </CardGroup>
      <br>      
      
      
      </br>
      <CardGroup style={{ padding: 30 }}>
        <Card style={{margin:20}}>
          <a href="https://akingsview.github.io/workday-calendar/" target="blank">
        <Card.Img variant="top" src="workdayScheduler.png" /></a>
        <Card.Body>
          <Card.Title>Workday Scheduler</Card.Title>
          <Card.Text>
          REAL TIME SCHEDULER USING HTML/CSS/JAVASCRIPT/MOMENT
          </Card.Text>
        </Card.Body>
        </Card>
        
        <Card style={{ margin: 20 }}>
          <a href='https://drive.google.com/file/d/1HD_i1pWPbFcwVHqAyhq1fFsnesnCRP6H/view' target="blank">
            <Card.Img variant="top" src="smDemo.png" />
            </a>
        <Card.Body>
          <Card.Title>Social Network API</Card.Title>
          <Card.Text>
              This API allows users to create thoughts and it allows others to react to them.
              Users can also friend each other.{' '}
          </Card.Text>
        </Card.Body>
        </Card>
        
        <Card style={{ margin: 20 }}>
          <a href='https://drive.google.com/file/d/1FC63pje2LtG_UNYVIQUUWMy7Qkd3ShiX/view' target="blank">
            <Card.Img variant="top" src="eCommerce.png" />
            </a>
        <Card.Body>
          <Card.Title>E-Commerce Back End</Card.Title>
          <Card.Text>
              This API is similar to the Shopify's framework. It demonstrates a full functioning server and database
              for inventory management and online sales.
          </Card.Text>
        </Card.Body>
      </Card>
    </CardGroup>  
    
    


</div>

  )
}

