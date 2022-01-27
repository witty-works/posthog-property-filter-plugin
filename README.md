# Property Filter Plugin

## Important!

This plugin will only work on events ingested **after** the plugin was enabled. This means it **will** register events as being the first if there were events that occured **before** it was enabled. To mitigate this, you could consider renaming the relevant events and creating an [action](https://posthog.com/docs/features/actions) that matches both the old event name and the new one.

## Usage

This plugin will set all configured properties to null inside an ingested event. Usually it makes sense to place this plugin at the *end* of the plugin chain.

Note in some cases it is necessary to pass in the property name both with and without
a leading `$`, f.e. `ip,$ip`.

## Credits

Heavily inspired by https://github.com/PostHog/first-time-event-tracker