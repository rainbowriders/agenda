
<h3 style="border-bottom: 1px solid black; padding-bottom: 10px;">Meeting info:</h3>
<table style="font-size: 1.1em;border-collapse: collapse; width: 100%">
    <tbody>
    @if($meeting->title)
        <tr>
            <td><strong>Meeting title:</strong></td>
            <td style="width: 85%"><%$meeting->title%></td>
        </tr>
    @endif
    @if($meeting->date)
        <tr>
            <td><strong>Meeting date:</strong></td>
            <td style="width: 85%"><%$date%></td>
        </tr>
    @endif
    @if($meeting->place)
        <tr>
            <td><strong>Meeting place:</strong></td>
            <td style="width: 85%"><%$meeting->place%></td>
        </tr>
    @endif
    <tr>
        <td><strong>Minute taker:</strong></td>
        <td style="width: 85%"><span>
				@if($meeting->minute_taker_first_name)
                    <span><%$meeting->minute_taker_first_name%></span><span> <%$meeting->minute_taker_last_name%></span>
                @endif
                <span>&lt;<%$meeting->minute_taker_email%>&gt;</span>
				</span>
        </td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid black"><strong>Attendees:</strong></td>
        <td style="border-bottom: 1px solid black">
            @foreach($meeting->attendants as $attendat)
                <span >
							@if($attendat->first_name)
                        <span><%$attendat->first_name%></span><span> <%$attendat->last_name%></span>
                    @endif
                    <span>&lt;<%$attendat->email%>&gt;; </span>
						</span>
            @endforeach
        </td>
    </tr>
    </tbody>
</table>
<table style="border-collapse: collapse; width: 100%">
    <tbody style="border-bottom: 1px solid black">
    <tr>
        <td colspan="4">
            <h3 style="border-bottom: 1px solid black; padding-bottom: 10px;">About this meeting/Agenda</h3>
        </td>
    </tr>
    <?php
    $i = 0;
    foreach($meeting->agenda as $agenda)
    {
        if($i % 2 == 1)
        {
            echo "<tr style=\"background-color:#eeeeee;font-size:1.1em;\">" .
                    "<td style=\"padding:5px;\">" . $agenda->number . ".</td>" .
                    "<td style=\"padding:5px;\" colspan=\"3\">" . $agenda->text . "</td>" .
                    "</tr>";
        }
        else
        {
            echo "<tr style=\"background-color:white;font-size:1.1em;\">" .
                    "<td style=\"padding:5px;\">" . $agenda->number . ".</td>" .
                    "<td style=\"padding:5px;\" colspan=\"3\">" . $agenda->text . "</td>" .
                    "</tr>";
        }
        $i++;
    }
    ?>
    <tr>
        <td colspan="4" style="padding-top: 30px;"><h3>Meeting minutes</h3></td>
    </tr>
    <tr>
        <td style="padding-left:5px; border-bottom: 1px solid black; border-top: 1px solid black; padding-top: 20px;padding-bottom: 10px"></td>
        <td style="padding-left:5px; border-bottom: 1px solid black; border-top: 1px solid black; padding-top: 20px;padding-bottom: 10px"><strong>Type</strong></td>
        <td style="padding-left:5px; border-bottom: 1px solid black; border-top: 1px solid black; padding-top: 20px;padding-bottom: 10px"><strong>Note</strong></td>
        <td style="padding-left:5px; border-bottom: 1px solid black; border-top: 1px solid black; padding-top: 20px;padding-bottom: 10px"><strong>Owner</strong></td>
    </tr>
    @foreach($meeting->agenda as $index => $value)
        <tr>
            <td colspan="4" style="background-color: #cccece; padding:5px; border-top: 1px solid black"><strong><%$value->number%>. <%$value->text%></strong></td>
        </tr>
        <?php
        $i = 0;
        foreach ($value->note as $i => $n)
        {
            if($i % 2 == 1)
            {
                echo "<tr style=\"background-color:#eeeeee;font-size:1.1em;\">" .
                        "<td style=\"padding:5px;\">" . $value->number . "." . $i . ".</td>" .
                        "<td style=\"padding:5px;white-space: nowrap;color:". $noteColors[$n->type['title']]."\">" . $n->type['title'] . "</td>" .
                        "<td style=\"padding:5px;\">" . $n->body . "</td>" .
                        "<td style=\"padding:5px;white-space: nowrap;\">" . $n->ownerNames . "</td>" .
                        "</tr>";
            }
            else
            {
                echo "<tr style=\"background-color:white;font-size:1.1em;\">" .
                        "<td style=\"padding:5px;\">" . $value->number . "." . $i . ".</td>" .
                        "<td style=\"padding:5px;white-space: nowrap;color:". $noteColors[$n->type['title']]."\">" . $n->type['title'] . "</td>" .
                        "<td style=\"padding:5px;\">" . $n->body . "</td>" .
                        "<td style=\"padding:5px;white-space: nowrap;\">" . $n->ownerNames . "</td>" .
                        "</tr>";
            }
            $i++;
        }
        ?>
    @endforeach
    </tbody>
</table>

