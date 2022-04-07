Components that go in this folder
* Are React components (hence in `components/`)
* That do not require the browser context to function (hence in `core/`; note, currently not enforced beyond intuition)
* That involve WriteRite-specific requirements and concepts, yet do not deal with persistence or services beyond the Next app itself (hence in `application/`)