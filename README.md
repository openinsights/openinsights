# Open Insights (working title)

Based on the original Fastly [Insights.js](https://github.com/fastly/insights.js)
client, Open Insights is a framework for constructing browser-based RUM clients.
It allows a site owner to construct their own client using one or more "providers".
The client is then self-hosted and deployed alongside the rest of their JavaScript
resources.

This repository contains the framework "core" component. This component is meant
to be added into your own project along with one or more providers. These are then
imported by your code, and everything is compiled to produce a client JavaScript
file deployable to production.

## Why Use It

1. Open Insights represents a collaboration by industry members to measure, and ultimately
   improve, the internet as a whole.
1. Open Insights is designed to work with multiple vendors.
1. Open Insights is meant to be self-hosted, unlike many vendor-centric, browser-based
   RUM clients.
1. Open Insights gives the site owner control over code compilation and included
   functionality.
