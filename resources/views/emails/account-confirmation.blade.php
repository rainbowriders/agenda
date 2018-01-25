<h3>Hello <% $user->first_name %> <% $user->last_name %>,</h3> 
<br/>
<p>
Please confirm your account by clicking the following link:
<a href="<% url() %>/#/confirm-account/<% $user->confirmation_token %>"> confirm account</a>
</p>
<br/>
<p>
If you did not register in <strong>Rainbow Minutes</strong>, please ignore this e-mail!
</p>
<p>
    <span style="display: block">Kind Regards,</span>
    <span style="display: block">Rainbow Agenda Team</span>
</p>