<td class="bench-checkbox-container align-center">
  <% if (enable == false) { %> <button class="pure-button benchmark-selector-btn bench-selector-ko"><span>&nbsp;</span></button>
    <% } else { %> <button class="pure-button benchmark-selector-btn bench-selector-ok"><span>&nbsp;</span></button>
      <% } %>
</td>
<td class="">
  <%- title %>
</td>
<td class="align-center">
  <%- iter %>
</td>
<td class="align-center">
  <%- avg %>
</td>
<td class="align-center">
  <%- min %>
</td>
<td class="align-center">
  <%- max %>
</td>
