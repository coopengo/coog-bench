<td class="bench-checkbox-container text-center">
  <button type="button" class="btn btn-sm bench-selector-btn">
    <span>&nbsp;
      <%= selected ? 'Enabled' : 'Disabled' %>
    </span>
  </button>
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
