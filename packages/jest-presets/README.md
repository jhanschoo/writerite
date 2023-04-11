# jest-presets

Note: at the moment we leave the sole FE project's jest config colocated
in its workspace rather than define it here, due to the next dependency,
etc. making it just busywork to colocate here with redefined dependencies.
On the other hand, the apiserver has a preset defined here for common
options between the integration test suite and the unit test suite.
