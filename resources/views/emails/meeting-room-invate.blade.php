<p>Hi,</p>

<p>
@if($meeting->minute_taker_first_name)
<% ucfirst($meeting->minute_taker_first_name)%> <% ucfirst($meeting->minute_taker_last_name) %>
@else
<%$meeting->minute_taker_email %>
@endif
 sent you an agenda for a new meeting.
</p>
<p>
In order to view the agenda, click the following link:
</p>
<p>
<a href="<% url() %>/#/meeting/<% $uniqueStringID %>" target="_blank"><% url() %>/#/meeting/<% $uniqueStringID %></a>
</p>
<p>You can read more about Rainbow Agenda on <a href="http://agenda.rainbowriders.dk/" target="_blank">http://agenda.rainbowriders.dk/</a>.</p>
<p>
	<span style="display: block">Kind Regards,</span>
	<span style="display: block">Rainbow Agenda Team</span>
</p>