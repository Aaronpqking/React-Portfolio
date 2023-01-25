import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Parallax } from 'react-parallax'
import { useState } from 'react';
import moment from 'moment';





  function Home() {
    const [date] = useState(new Date());
    const formattedDate = moment(date).format('MMMM Do YYYY, h:mm a');
    
    return (
    <div className='bg-primary'>  
  <section className="jumbotron bg-primary">
    <div class="position-relative"></div>
    <h1 class="display-3 me-3">AARON KING</h1>
    <p class="lead center margin-right">A look into my work as an apsiring human</p>
    <p>{formattedDate}</p>
  </section>
      
  <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={require('../images/suhka.jpg')}
        bgImageAlt="Aaron King in Suhkasana"
        strength={-200}
    >

      <div>
          <div className="vimeobox">
      <div className="row">
          <div className="col-4 rounded">
            <div className="card-body bg-light rounded">
              <img src="sixword.png" className="card-img-top" alt="..."></img>
                    <h5 className="card-title">Six in the city</h5>
                    <p className="card-text">A short (bio) talk I did in collaboration with Larry Smith and the team at 6 word memiors.</p>
                    <a href="https://vimeo.com/181224582" className="btn btn-primary">Watch</a>
            </div>           
          </div>
      <div className="col">
            <br>
              </br>
        <br>
                </br>
                <br>
                
                </br>
      </div>
    </div>
  </div>
      </div>
      <p className="biotext">
Like meditation, yoga found me at a time when I needed it most. I thought that I could find happiness  through my career, but it wasn't enough. My training  taught me to honor my inner voice. I teach all 8 limbs of yoga with a strong  focus on awareness and breath-work. Through intelligent  sequencing, I guide a practice that allows you to truly connect with and  strengthen your mind and body. In 2015, I founded the Dharma House. I enjoy using a fluid  combination of modalities. My passions include spirituality, emotional  intelligence, health and wellness, philosophy, and nutrition. My  mission is to master the power of the mind and body, and teach others to  do the same. Here I believe we find not only power, but joy.
        </p>

        <div style={{ height: '450px' }} />
    </Parallax>
</div>
  );
}

export default Home;
