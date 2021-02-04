function aboutMe() {
  $(".navbar-collapse").removeClass("show");
  mainDiv.html("");
  mainDiv.html(`<div class="card mb-3">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="../../img/aboutMe.jpg" class="card-img" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">About Me</h5>
        <h4>Michael Bugayets</h4>
        <p class="card-text">I am mechanical practical engineer. 
        I have been working in this profession for 10 years. 
        I started in factory to create high pressure pumps. 
        After that I worked for a company that makes automated warehouses. 
        And recently I work in the role of aircraft structure inspector at Israel aerospace industries. 
        And now I decided to change the field of practice and study a new field and the choice fell on programming. 
        That's how I got to John Bryce College. 
        And I shifting into the world of programming.</p>
      </div>
    </div>
  </div>
</div>`);
}
