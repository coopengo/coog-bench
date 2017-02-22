<td class="bench-checkbox-container align-center">
  <% if (enable == true) { %> <button class="pure-button benchmark-selector-btn bench-selector-ko"><span>&nbsp;Abled</span></button>
    <% } else { %> <button class="pure-button benchmark-selector-btn bench-selector-ok"><span>&nbsp;Disabled</span></button>
      <% } %>
</td>
<td class="">
  <%- name %>
</td>
<td class="align-center">
  <%- iterations %>
</td>
<td class="align-center">
  <%- average %>
</td>
<td class="align-center">
  <%- minimum %>
</td>
<td class="align-center">
  <%- maximum %>
</td>
