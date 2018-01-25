<p>Hi,</p>
<p><%$meeting->minute_taker_first_name%> <%$meeting->minute_taker_last_name%> sent you the notes from a meeting.</p>
<p>In order to view the notes, click the following link:</p>
<p>
    <a href="<%url()%>/#/meeting/<%$meeting->uniqueStringID%>" target="_blank"><%url()%>/#/meeting/<%$meeting->uniqueStringID%></a>
</p>
<p>
    You can read more about Rainbow Agenda on <a href="http://agenda.rainbowriders.dk/" target="_blank">http://agenda.rainbowriders.dk/</a>
</p>
<p>
    <span style="display: block">Kind Regards,</span>
    <span style="display: block">Rainbow Agenda Team</span>
</p>