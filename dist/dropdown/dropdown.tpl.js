<div class="zdh-dropdown{{if equalWidth}} zdh-dropdown-equalWidth{{/if}}">
    <label class="zdh-dropdown-label">
        <span class="zdh-dropdown-text">dropdown</span>
        <span class="zdh-dropdown-icon"></span>
    </label>
    <ul class="zdh-dropdown-list">
        {{each items}}
            <li data-value="{{$value.value}}" class="zdh-dropdown-item">{{$value.text}}</li>
        {{/each}}
    </ul>
</div>
