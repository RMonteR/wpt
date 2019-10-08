// This is called from the portal host which is running with the test harness.
// This creates a portal and communicates with our ad hoc test harness in the
// portal context which performs the history manipulation in the portal. Once
// we confirm that the history manipulation works as expected in the portal,
// we confirm that the session history of the portal host is not affected by any
// history changes in the portal.
async function runTestInPortal(portalSrc, testName) {
  let initialLocation = location.href;
  assert_equals(history.length, 1);
  assert_false(!!history.state);

  let portal = document.createElement('portal');
  portal.src = portalSrc + '?testName=' + testName;
  let result = await new Promise((resolve) => {
    portal.onmessage = (e) => {
      resolve(e.data);
    };
    document.body.appendChild(portal);
  });

  assert_equals(result, 'Passed');

  // Ensure that top level history was not affected by navigations within the
  // portal.
  assert_equals(location.href, initialLocation);
  assert_equals(history.length, 1);
  assert_false(!!history.state);
}
