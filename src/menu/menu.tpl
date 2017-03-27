<div class="row">
  </br>
</div>
<div class="row">
  <div class="col-sm-2 col-xs-2 col-sm-offset-5 col-xs-offset-3 hidden-lg hidden-md">
    <img src="<%- require('../static/coopengo.jpg') %>" id="myImg"> </div>
</div>
<div class="row">
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 col-lg-offset-1 col-md-offset-1 col-sm-offset-4 col-xs-offset-2">
    <button type="button" class="btn btn-default btn-circle" id="buttonmess" data-toggle="modal"
      data-target="#modalMessage">
      <i class="glyphicon glyphicon-comment"></i>
    </button>
  </div>
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">
    <button type="button" class="btn btn-default btn-circle" id="buttonclean" data-toggle="tooltip"
      data-placement="bottom" title="Refresh the Page">
      <i class="glyphicon glyphicon-erase"></i>
    </button>
  </div>
  <div class="col-lg-2 col-md-2 col-lg-offset-1 col-md-offset-1 hidden-sm hidden-xs">
    <img src="<%- require('../static/coopengo.jpg') %>" id="myImg"> </div>
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">
    <button type="button" class="btn btn-default btn-circle" id="buttontasks" data-toggle="tooltip"
      data-placement="bottom" title="Drop the Table">
      <i class="glyphicon glyphicon-trash"></i>
    </button>
  </div>
  <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1">
    <button type="button" class="btn btn-default btn-circle" id="buttonlgt" data-toggle="tooltip"
      data-placement="bottom" title="Logout">
      <i class="glyphicon glyphicon-off"></i>
    </button>
  </div>
</div>
<!-- Modal -->
<div id="modalMessage" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Contact Us</h4>
      </div>
      <div class="modal-body aligned-center">
        <p>Do you want to sens us a message ? </p>
        <p>More info about Coopengo :
          <a href="url">http://www.coopengo.com</a>
        </p>
      </div>
    </div>
  </div>
</div>
