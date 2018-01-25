<p>Hi,</p>
<p>
<% $user->first_name %> <% $user->last_name %>, please reset your password by clicking the following link:
</p>
<p>
<a href="<% url() %>/#/new-password?reset-password-token=<% $reset_password_link %>"><% url() %>/#/new-password?reset-password-token=<% $reset_password_link %></a>
</p>
<p>
    <span style="display: block">Kind Regards,</span>
    <span style="display: block">Rainbow Agenda Team</span>
</p>