<!-- <p>Bench <%- title %>: <%- value %></p> -->
<div class="pure-g bench">

    <!-- Title line -->
    <div class="pure-u-1-2 bench-title-elem"><p class="bench-title">Benchmark <%- title %></p></div>
    <div class="pure-u-1-2 bench-title-elem status"><p class="bench-state">Status: <%- status %></p></div>
    <div class="pure-u-1-2 bench-title-elem iter"><p class="bench-iter"><%- iter %> Iterations</p></div>

    <!-- Body -->
    <div class="pure-u-1 bench-body"> <div class="pure-g">
        <div class="pure-u-1-2">
            <div class="pure-g bench-left-panel">
                <div class="pure-u-1"><p class="bench-panel-line">Average:</p></div>
                <div class="pure-u-1"><p class="bench-panel-line"><%- avg %></p></div>
            </div>
        </div>

        <div class="pure-u-1-2">
            <div class="pure-g bench-right-panel">
                <div class="pure-u-1"><p class="bench-panel-line float-right">Min : <%- min %></p></div>
                <div class="pure-u-1"><p class="bench-panel-line float-right">Max : <%- max %></p></div>
            </div>
        </div>
    </div> </div>

    <div class="pure-u-1 custom-body"> <div class="pure-g">
        <div class="pure-u-1">
            <div class="pure-g bench-single-panel">
                <div class="pure-u-1"><p class="bench-panel-line">Score: <%- score %></p></div>
            </div>
        </div>
    </div> </div>


    <div class="pure-u-1 bench-loading"> <div class="pure-g">
        <div class="pure-u-1-3"></div>
        <div class="pure-u-1-3">
            <img class="loading-img" src="assets/images/loading.gif" alt="Loading...">
        </div>
        <div class="pure-u-1-3"></div>
    </div> </div>


</div>

