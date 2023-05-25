import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../Style/resume.css';
import Contact from './Contact';

function Resume() {
    return (

      
   
      <Container>
        <section className="my-5">Oh
          <div className="my-2">
            <p><a>
              <Button href="\Users\aaron\Desktop\Resume.pdf" download variant="primary">
                Resume
              </Button>
            </a>      <Contact />
</p>
          </div>
        </section>

            <Row>
              <Col>
            <h1>Aaron King</h1>
            <h2 className='title'>Software & Solutions Engineer</h2>
            <Col></Col>
          </Col>
          
        </Row>
        <br></br>
            <Row>
              <Col>
                <h2>Summary</h2>
                <p>I am an ambitious and results-driven professional with a diverse background in team building, business development, operations management, and leadership. I am a recent graduate of The Ohio State University's Full Stack Web Development Bootcamp with a strong understanding of HTML, CSS, JavaScript, Git, Bootstrap, Node.js, Express, Heroku, MySQL, React, and MERN. Prior to my career in technology, I served as a United States Marine and am a business owner and founder. My experience in the military instilled a strong sense of problem-solving, logical thinking, and team coordination. I am a quick learner, have a natural passion for sharing knowledge with others, and am known for my big picture thinking and dad jokes. My background in business development, team building, and leadership allows me to understand the needs of clients and effectively communicate with cross-functional teams.I have a proven track record in leading and managing teams, implementing performance metrics and driving productivity.I am eager to bring my skills and experience to a role such as a Sales Engineer, utilizing my technical knowledge, creativity and strategic planning to drive sales and growth. </p>
              </Col>
        </Row>
        <br></br>
        <br></br>
            <Row>
              <Col>
                <h2>Education</h2>
                <p>The Ohio State University / Full Stack Certification
July 2022- January 2023, Columbus, Oh (Remote)
24-week intensive program focused on gaining technical programming
skills.</p>
            <p>
Columbus State Community College / Sports & Exercise Science
September 2013 - May 2015, Columbus, Oh
Associates in Sports and Exercise Science (incomplete)</p>
            <p>
Six Seconds / Brain Profiles - EQ Practitioner Certification
2019 - 2020, Scottsdale, AR
Advanced Emotional Intelligence assessment training</p>
            <p>
Yoga on High / Meditation Teacher Training
2014 - 2015, Columbus, Oh
Meditation Teacher training in breathwork, mindfulness and philosophy</p>
            <p>
Balanced Yoga / Yoga Teacher Training
2011 - 2012, Columbus, OH
300-hour yoga training in anatomy, alignment and yoga philosophy</p>
              </Col>
              <Col>
                <h2>Experience</h2>
                <p>The Dharma House / CEO-Founder-Teacher
2012 - PRESENT, Columbus, Oh
Full responsibility for community and business development, finance, and
asset management, training and education.
Manages database, website and marketing tasks, and drives future
initiatives and innovation.
Lead Teacher for group/private yoga classes and workshops</p>
<p>ABM/ Area Manager
2010-2011, Columbus, Oh
Implemented metrics, productivity levels, and process management to
achieve site goals
Managed all client/business communication and data input/feedback
Conducted weekly/monthly meetings in correspondence to site
management team reports/data collection
Ensured all budget/sales goals were maintained and analyzed with the
site management teams monthly.
ᅳ</p>
<p>Experience Sodexo / Ops Manager
2001- 2005 /2008-2009, Cincinnati, Oh Terre Haute, In Springfield, Oh
Managed all Environmental Services operations within 2 main campuses
& 4 outpatient buildings
Restructured programs including team member core values and
responsibilities, safety/MSDS programs, labor allocations and
management protocols
Chaired and sat on several committees in order to impact safety/hazmat,
operation flow processes, service standards, and company culture
Developed team metrics and standards to ensure overall/individual
productivity, task completion, quality control and team efficiency</p>
              </Col>
        </Row>
        <br></br>
        <br></br>
            <Row>
              <Col>
              <h3>Front-end Proficiencies</h3>
        <ul className="skills">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>jQuery</li>
          <li>responsive design</li>
          <li>React</li>
          <li>Bootstrap</li>
            </ul>
          </Col>
          <Col>
        <h3>Back-end Proficiencies</h3>
        <ul className="skills">
          <li>APIs</li>
          <li>Node</li>
          <li>Express</li>
          <li>MySQL, Sequelize</li>
          <li>MongoDB, Mongoose</li>
          <li>REST</li>
          <li>GraphQL</li>
        </ul>
              </Col>
        </Row>
          </Container>
        );
      }
      
      
      

            
//     //         <div style={{ height: '450px' }} />
//     // </Parallax>
//   );
// }

export default Resume;
