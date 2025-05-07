import { useState } from 'react';
import styles from "./Webpage.module.css";
import { Link } from 'react-router-dom';
import bgabout from "../../../src/assets/3image-abtus.png";
import ourclassframe1 from "../../../src/assets/ourclasscopy-frame1.png";
import ourclassframe2 from "../../../src/assets/ourclass-frame2.png";
import ourclassframe3 from "../../../src/assets/ourclass-frame3.png";
import timeouticon from "../../../src/assets/timer-outlineicon.png";
import trainer051 from "../../../src/assets/trainer-pic1.png";
import trainer052 from "../../../src/assets/trainer-pic2.png";
import trainer053 from "../../../src/assets/trainer-pic3.png";
// import uplocation from "../../../src/assets/up-location.png";
import feedbackimg from "../../../src/assets/feedback-trainer.png";
import starfive from "../../../src/assets/5star.png";
import bodybuilder from "../../../src/assets/img-trainer.png";




const trainers = [
  {  image: trainer051 },
  {  image: trainer052 },
  {  image: trainer053 },
  {  image: trainer053 },
  {  image: trainer052 },
  {  image: trainer051 },
  {  image: trainer052 },
  {  image: trainer053 },
  {  image: trainer051 },
];

// const locations = [
//   {
//     name: "Location name",
//     query: "London",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//   },
//   {
//     name: "Location name",
//     query: "Manchester",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//   },
//   {
//     name: "Location name",
//     query: "Birmingham",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//   },
//   {
//     name: "Location name",
//     query: "Leeds",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//   },
//   {
//     name: "Location name",
//     query: "Birmingham",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//   },
 
// ];

const slides = [
  { title: 'Jhony Breaker', image: feedbackimg },
  { title: 'Jane Power', image: feedbackimg },
  { title: 'Mike Strong', image: feedbackimg }
];




 


const Webpage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(trainers.length / itemsPerPage);
  const start = pageIndex * itemsPerPage;
  const visibleTrainers = trainers.slice(start, start + itemsPerPage);

 
  // const ITEMS_PER_PAGE = 3;
  // const [currentPage, setCurrentPage] = useState(0);
  // const startIndex = currentPage * ITEMS_PER_PAGE;
  // const visibleLocations = locations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  // const pageCount = Math.ceil(locations.length / ITEMS_PER_PAGE);
  
  const moveSlide = (direction) => {
    const nextSlide = (currentSlide + direction + slides.length) % slides.length;
    setCurrentSlide(nextSlide);
  };
 
  


  return (

<>
{/* Container-1 */}

    <div className={styles.webpagecontainer}>
<div className={styles.webpagesection}>
<h2 className={styles.webpagehead01}>FITNESS</h2>
<Link to="/signin" className={styles.webpageLink01} >SIGNIN/SIGNUP</Link>
</div>

<div className={styles.webpagesection01}>
  <h2 className={styles.webpagehead001}>READY TO TRAIN</h2>
  <h2 className={styles.webpagehead002}>YOUR BODY</h2>
  <p className={styles.webpagepara01}>Gym training is a structured and disciplined approach to physical 
    exercise that focuses on strength, endurance and overall fitness improvement.</p>
<Link to="/" className={styles.webpagelink02}>JOIN NOW</Link>
</div> 

<div className={styles.webpagesection02}>
  
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>20+</h2>
        <p className={styles.labelsectwo}>Years of Experience</p>
      </div>
      <div className={styles.dividersectwo} />
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>15K+</h2>
        <p className={styles.labelsectwo}>Members Join</p>
      </div>
      <div className={styles.dividersectwo} />
      <div className={styles.statBoxsectwo}>
        <h2 className={styles.numbersectwo}>14K+</h2>
        <p className={styles.labelsectwo}>Happy members</p>
      </div>
    </div>

    <div className={styles.webpagesection03}>
      <div className={styles.sliderWrapper}>
        <p className={styles.webpagesecsliding}>
          YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS
        </p>
        <p className={styles.webpagesecsliding}>
          YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS - YOU'RE FEARLESS
        </p>
      </div>
    </div>
    </div>

{/* Container-2 */}

<div className={styles.webpagecontainer02}>
  <div className={styles.websubpagecont02}>
      <h2 className={styles.headingcont02}><span className={styles.whiteTextcont02}>WHY</span> <span className={styles.orangeTextcont02}>CHOOSE US</span></h2>
      <p className={styles.subheadingcont02}>
      Gym workouts offer a versatile and customisable experience, allowing everyone to set specific fitness goals.      </p>
      <div className={styles.rowcont02}>
          <div className={styles.cardcont02}>
            <h3 className={styles.cardNumbercont02}>01</h3>
            <h4 className={styles.cardTitlecont02}>PERSONAL TRAINING</h4>
            <p className={styles.cardTextcont02}>Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals</p>
          </div>
          <div className={styles.cardcont02}>
            <h3 className={styles.cardNumbercont02}>02</h3>
            <h4 className={styles.cardTitlecont02}>NUTRITION COUNSELING</h4>
            <p className={styles.cardTextcont02}>Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals</p>
          </div>
          </div>

        <div className={styles.rowcont02}>

          <div className={styles.cardcont02}>
            <h3 className={styles.cardNumbercont02}>03</h3>
            <h4 className={styles.cardTitlecont02}>EQUIPMENT AND FACILITIES</h4>
            <p className={styles.cardTextcont02}>Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals</p>
          </div>
          <div className={styles.cardcont02}>
            <h3 className={styles.cardNumbercont02}>04</h3>
            <h4 className={styles.cardTitlecont02}>SPECIALITY PROGRAMS</h4>
            <p className={styles.cardTextcont02}>Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals</p>
          </div>
        </div>
      </div>
   
    </div>

    {/* Container-3 */}

    <div className={styles.webpagecontainer03}>
      <div className={styles.websubcontainer003}>
     
      <div className={styles.bgaboutimgcont03}>
    <h2 className={styles.websubcont03}>we have a lot of</h2>
    <h2 className={styles.websubconts03}> experience</h2>
    <p className={styles.websubtextconts03}>
    In quisque nunc dictumst etiam pellentesque et. Vel malesuada diam 
    lorem tellus. Amet mauris feugiat ipsum natoque odio donec. Sit at 
    lacus consequat justo odio condimentum dui. Faucibus id blandit
     feugiat mi tellus sit etiam donec aliquam. Dictumst egestas ut 
     facilisi vel.

    </p> <br />
    <p className={styles.websubtextconts03}>
    Sem consequat fermentum pellentesque risus purus quis gravida. 
    Nulla porttitor ultrices facilisis non commodo diam morbi cursus eu. 
    Semper ut in mauris gravida id cursus urna. Magnis vulputate orci
     risus felis eget lectus morbi. Et cursus mauris condimentum pretium 
     arcu sed dignissim.

    </p>
    </div>

    <div className={styles.bgaboutimgcont3}>
        <img src={bgabout} className={styles.webbgaboutimg}  alt=''></img>
      </div>

    </div>
    </div>


      {/* Container-4 */}

      <div className={styles.webpagecontainer04}>
      <div className={styles.websubcontainer004}>
    <h2 className={styles.websubcont04}> Our <span className={styles.websubspancont04}> Classes</span></h2>

       <div className={styles.websubsection004}>
        <div className={styles.websubsecflx04}>
        <img src={ourclassframe1} className={styles.webcont04img}  alt=''></img>
<div className={styles.websecflxsub04}>
  <div className={styles.websecflx01sub04}>
<h2 className={styles.websubcont0104}>YOGA</h2>
  </div> 
  <div className={styles.websecflx02sub04}>
    <img src={timeouticon} alt=''></img>
    <h2 className={styles.websubcont0104}>2H</h2>
  </div>
</div>
<div className={styles.webmainsubtext0104}>
<p className={styles.websubtext0104}>
Lorem Ipsum has been the industry's standard dummy text ever since the
 1500s, when an unknown printer took a galley of type and scrambled it
  to make a type
</p>
</div>
<div className={styles.websublink01s04}>
<Link to="/"  className={styles.websublink0104} >Learn more</Link>
        </div>
        </div>

        <div className={styles.websubsecflx04}>
        <img src={ourclassframe2} className={styles.webcont04img}  alt=''></img>
        <div className={styles.websecflxsub04}>
  <div className={styles.websecflx01sub04}>
<h2 className={styles.websubcont0104}>YOGA</h2>
  </div> 
  <div className={styles.websecflx02sub04}>
    <img src={timeouticon} alt=''></img>
    <h2 className={styles.websubcont0104}>2H</h2>
  </div>
</div>
<div className={styles.webmainsubtext0104}>
<p className={styles.websubtext0104}>
Lorem Ipsum has been the industry's standard dummy text ever since the
 1500s, when an unknown printer took a galley of type and scrambled it
  to make a type
</p>
</div>
<div className={styles.websublink01s04}>

<Link to="/"  className={styles.websublink0104} >Learn more</Link>
        </div>
          </div> 

        <div className={styles.websubsecflx04}>
        <img src={ourclassframe3} className={styles.webcont04img}  alt=''></img>

        <div className={styles.websecflxsub04}>
  <div className={styles.websecflx01sub04}>
<h2 className={styles.websubcont0104}>YOGA</h2>
  </div> 
  <div className={styles.websecflx02sub04}>
    <img src={timeouticon} alt=''></img>
    <h2 className={styles.websubcont0104}>2H</h2>
  </div>
</div>
<div className={styles.webmainsubtext0104}>
<p className={styles.websubtext0104}>
Lorem Ipsum has been the industry's standard dummy text ever since the
 1500s, when an unknown printer took a galley of type and scrambled it
  to make a type
</p>
</div>
<div className={styles.websublink01s04}>
<Link to="/"  className={styles.websublink0104} >Learn more</Link>
        </div>
        </div>

       </div>
       <div className={styles.websubendbutton}>
       <div className={styles.websubendbutton01}>
       <Link to="/"  className={styles.websublink00204} >See all</Link>
       </div>
       </div>
       </div>
        </div>


{/*  Container-5  */}
<div className={styles.webpagecontainer05}>
<div className={styles.webpagenextsec05}>
  <h2 className={styles.webpageheader05}>
  OUR PROFESSIONAL <span className={styles.webspanpage05}>TRAINERS</span> 
  </h2>
  <p className={styles.webpagepara05}>Whether you're looking to set up a home gym or enhance
     your current workout routine</p>
     <div className={styles.sliderContainerwebpage05}>
      <div className={styles.trainerGridwebpage05}>
        {visibleTrainers.map((trainer, i) => (
          <div key={i} className={styles.trainerCardwebpage05}>
            <img src={trainer.image} className={styles.trainerCardimg05} alt={trainer.name} />
           
          </div>
        ))}
      </div>

      <div className={styles.dotsContainerwebpage05}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={pageIndex === i ? styles.activeDotwebpage05 : styles.dotwebpage05}
            onClick={() => setPageIndex(i)}
          ></span>
        ))}
      </div>
    </div>
    </div>
    </div>

    {/* Container-6 */}

    <div className={styles.webpagecontainer06}>
      <h2 className={styles.webpage06heading}>OUR <span className={styles.webpage06spanheading}>PACKAGES</span></h2>
      <div className={styles.webpage06packagesContainer}>
        
        {/* Drop-In Package */}
        <div className={styles.webpage06packageCard}>
        <div className={styles.webpage06ribbon}>Best Offer</div>

          <h3 className={styles.webpage06packageTitle}>DROP-IN PACKAGE</h3>
          <ul className={styles.webpage06featureListul}>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Unlimited Gym Access</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 2x Fitness Consultant</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Nutrition Tracking</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 1x Free Supplement</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 3 Days per week</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Personal Trainer</li>
</ul>
          <button className={styles.webpage06purchaseButton}>PURCHASE NOW</button>
        </div>

        {/* Monthly Package - Best Offer */}
        <div className={styles.webpage06packageCard}>
          <div className={styles.webpage06ribbon}>Best Offer</div>
          <h3 className={styles.webpage06packageTitle}>MONTHLY PACKAGE</h3>
          <ul className={styles.webpage06featureList}>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Unlimited Gym Access</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 2x Fitness Consultant</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Nutrition Tracking</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 1x Free Supplement</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 3 Days per week</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Personal Trainer</li>
</ul>
<button className={styles.webpage06purchaseButton}>PURCHASE NOW</button>
</div>

        {/* Mid Package */}
        <div className={styles.webpage06packageCard}>
        <div className={styles.webpage06ribbon}>Best Offer</div>

          <h3 className={styles.webpage06packageTitle}>MID PACKAGE</h3>
          <ul className={styles.webpage06featureList}>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Unlimited Gym Access</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 2x Fitness Consultant</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Nutrition Tracking</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 1x Free Supplement</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 3 Days per week</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Personal Trainer</li>
</ul>
          <button className={styles.webpage06purchaseButton}>PURCHASE NOW</button>
        </div>

        {/* Annual Package */}
        <div className={styles.webpage06packageCard}>
        <div className={styles.webpage06ribbon}>Best Offer</div>

          <h3 className={styles.webpage06packageTitle}>ANNUAL PACKAGE</h3>
          <ul className={styles.webpage06featureList}>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Unlimited Gym Access</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 2x Fitness Consultant</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Nutrition Tracking</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 1x Free Supplement</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> 3 Days per week</li>
  <li className={styles.webpage06featureListli}><span className={styles.webpage06checkIcon}>✔</span> Personal Trainer</li>
</ul>
          <button className={styles.webpage06purchaseButton}>PURCHASE NOW</button>
        </div>

      </div>
    </div>

    {/* Container-7 */}

     {/* <div className={styles.webpagecontainer07}>
      <h2 className={styles.webpage7sectionTitle}>
        OUR <span className={styles.webpage7highlight}>FITNESS CENTERS</span>
      </h2>

      <div className={styles.webpage7cardGrid}>
        {visibleLocations.map((loc, index) => (
          <div key={index} className={`${styles.webpage7card} ${index === 1 ? styles.webpage7cardCenter : ''}`}>
            {index === 1 && (
              <div className={styles.webpage7mapContainer}>
                  <div><iframe  width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=30%25&amp;height=200&amp;hl=en&amp;q=Bangalore+(Location1)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/collections/personal-trackers/">Elderly trackers</a></iframe></div> 

              </div>
            )}
            <div className={styles.webpage7cardHeader}>
              <hr className={styles.webpage7line} />
              <span className={styles.webpage7locationTitle}>{loc.name}</span>
            </div>
            <div className={styles.webpage7uparrow}>
            <p className={styles.webpage7description}>{loc.description}</p>
            <img src={uplocation} className={styles.webpage7upimg} alt=''></img>
           </div>
            {index !== 1 && (
              <div className={styles.webpage7mapContainer}>
                 <div><iframe  width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=30%25&amp;height=200&amp;hl=en&amp;q=Bangalore+(Location1)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/collections/personal-trackers/">Elderly trackers</a></iframe></div> 

              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.webpage7pagination}>
        {Array.from({ length: pageCount }).map((_, i) => (
          <span
            key={i}
            className={i === currentPage ? styles.webpage7dotActive : styles.webpage7dot}
            onClick={() => setCurrentPage(i)}
          />
        ))}
      </div>
    </div> */}

   {/* Container-8 */}

    <div className={styles.webpagecontainer08}>
      <h2 className={styles.webpage8heading}>
        WHAT <span className={styles.webpage8highlight}>CLIENTS SAY</span> WITH US
      </h2>
      <div className={styles.webpage8text8}>
<p className={styles.webpage8textpara}>"I am extremely grateful for the positive impact gym training has had on my life;
   through consistent training, expert   guidance from coaches, and access to top-notch 
   facilities, I have witnessed a remarkable transformation in strength, endurance, and
    overall fitness levels."</p>
    <p></p>
    </div>

<div className={styles.webpage8carousel}>
      <button className={`${styles.webpage8arrow} ${styles.webpage8left}`} onClick={() => moveSlide(-1)}>&#10094;</button>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.webpage8slide} ${index === currentSlide ? styles.webpage8active : ''}`}
        >
          <img src={starfive} className={styles.webpage8star} alt=''></img>
          <h2 className={styles.webpage8title}>{slide.title}</h2>
          <img className={styles.webpage8image} src={slide.image} alt={slide.title} />
        </div>
      ))}

      <button className={`${styles.webpage8arrow} ${styles.webpage8right}`} onClick={() => moveSlide(1)}>&#10095;</button>
    </div>
     
    </div>

   {/* Container-9 */}

   <div className={styles.webpagecontainer09}>
      <div className={styles.webpage9container}>
        <div className={styles.webpage9left}>
          <img src={bodybuilder} alt="Bodybuilder" className={styles.webpage9image} />
        </div>
        <div className={styles.webpage9right}>
          <h1 className={styles.webpage9heading}>LET'S START GYM</h1>
          <h2 className={styles.webpage9subheading}>TRAINING NOW</h2>
          <p className={styles.webpage9offer}>
            Get 50% off the first three classes you sign up for this month any GYM membership
          </p>
          <form className={styles.webpage9form}>
            <input type="text" placeholder="Enter You Name.." className={styles.webpage9input} />
            <input type="text" placeholder="Numbers Phone.." className={styles.webpage9input} />
            <input type="email" placeholder="Your Email Address..." className={styles.webpage9inputFull} />
            <button className={styles.webpage9button}>JOIN NOW</button>
          </form>
        </div>
      </div>
    </div>

    
   {/* Container-10 */}

   <div className={styles.webpagecontainer10}>
  <div className={styles.webpage10logoSection}>
    <h2 className={styles.webpage10logo}>LOGO</h2>
    <p className={styles.webpage10description}>
      It Is A Long Established Fact That A Reader Will<br />
      Be Distracted By The Readable.
    </p>
  </div>
  <div className={styles.webpage10contactBox}>
    <p className={styles.webpage10contactTitle}>Call :</p>
    <p className={styles.webpage10contactNumber}>01234 987654<br />098765 34621</p>
    <p className={styles.webpage10contactTitle}>Mail :</p>
    <p className={styles.webpage10contactEmail}>contact@fitnessfit.com</p>
  </div>
</div>

<div className={styles.webpage010copywrite}>
  <p className={styles.webpage010copywriteend}>Copyright © <span className={styles.webpage010txtend}>Fitness</span>   | Designed 
  by third eye innovations</p>

</div>

</>


  )
}

export default Webpage