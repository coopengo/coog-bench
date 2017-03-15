<td class="bench-checkbox-container align-center">
  <% if (enable == true) { %> <button type="button" id="bench-button-go" class="btn btn-sm benchmark-selector-btn bench-selector-ko"><span>&nbsp;Enabled</span></button>
    <% } else { %> <button type="button"  id="btngo" class="btn btn-sm benchmark-selector-btn bench-selector-ok"><span>&nbsp;Disabled</span></button>
      <% } %>
</td>
<td class="align-center">
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