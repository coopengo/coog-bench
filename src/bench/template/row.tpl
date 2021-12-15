<td class="bench-checkbox-container text-center">
  <% if (selected == false) { %>
    <input type="checkbox">
    <% } else { %>
      <input type="checkbox" checked="checked">
      <% } %>
</td>
<td class="text-center">
  <%- name %>
</td>
<td class="text-center">
  <%- iterations %>
</td>
<td class="text-center">
  <%- average %>
</td>
<td class="text-center">
  <%- minimum %>
</td>
<td class="text-center">
  <%- maximum %>
</td>
<td class="text-center">
  <%- slowest %>
</td>
