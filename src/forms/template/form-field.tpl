<div class="form-control-group field-<%= key %>"> <label for="<%= editorId %>">
    <% if (titleHTML){ %><%= titleHTML %>
    <% } else { %><%- title %><% } %>
  </label> <span data-editor></span> <span data-error></span></div>
