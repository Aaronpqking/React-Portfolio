import React,{useState} from 'react';
import { Parallax } from 'react-parallax'
import 'bootstrap/dist/css/bootstrap.min.css'



function Contact() {



  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const { name, email, message } = formState;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errorMessage) {
      console.log('Submit Form', formState);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      // const isValid = validateEmail(e.target.value);
      // if (!isValid) {
      //   setErrorMessage('Your email is invalid.');
      // } else {
        setErrorMessage('');
      // }
    } else {
      if (!e.target.value.length) {
        setErrorMessage(`${e.target.name} is required.`);
      } else {
        setErrorMessage('');
      }
    }
    if (!errorMessage) {
      setFormState({ ...formState, [e.target.name]: e.target.value });
      console.log('Handle Form', formState);
    }
  };

  return (

    <Parallax
    blur={{ min: -15, max: 15 }}
    bgImage={require('../images/contact3.jpg')}
    bgImageAlt="the dog"
    strength={-200}
  >
    <section>
      <form id="contact-form" onSubmit={handleSubmit} className="formStyle">
        <div className="inputBox">
          <label htmlFor="name" className='labelSpace'>Name:</label>
          <input id="input"
            type="text"
            name="name"
            defaultValue={name}
            onBlur={handleChange}
          />
        </div>
        <div className="inputBox">
          <label htmlFor="email" className='labelSpace'>Email address:</label>
          <input  id="input"
            type="email"
            name="email"
            defaultValue={email}
            onBlur={handleChange}
          />
        </div>
        <div className="inputBox">
          <label htmlFor="message" className='labelSpace'>Message:</label>
          <textarea
            name="message"
            rows="5"
            defaultValue={message}
            onBlur={handleChange}
          />
        </div>
        {errorMessage && (
          <div>
            <p className="error-text">{errorMessage}</p>
          </div>
        )}
        <button type="submit" className="submit">Submit</button>
      </form>
    </section>
    <div style={{ height: '350px', width: '130px' }} />
    </Parallax>
    );
  }

export default Contact;
