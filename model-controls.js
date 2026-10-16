(() => {
  let activeExplorer = null;

  const focalToFieldOfView = (focalLength) => 2 * Math.atan(24 / (2 * focalLength)) * 180 / Math.PI;

  document.querySelectorAll("[data-model-explorer]").forEach((explorer) => {
    const model = explorer.querySelector("model-viewer");
    const exteriorButton = explorer.querySelector('[data-model-view="exterior"]');
    const interiorButton = explorer.querySelector('[data-model-view="interior"]');
    const walkControls = explorer.querySelector("[data-walk-controls]");
    const focalInput = explorer.querySelector("[data-focal-length]");
    const focalOutput = explorer.querySelector("[data-focal-output]");
    let interiorMode = false;

    [exteriorButton, interiorButton].forEach((button) => { if (button) button.disabled = true; });
    const enableViewButtons = () => [exteriorButton, interiorButton].forEach((button) => { if (button) button.disabled = false; });
    if (model.loaded) enableViewButtons();
    else model.addEventListener("load", enableViewButtons, { once: true });

    const setFocalLength = (millimeters) => {
      const focalLength = Number(millimeters);
      model.fieldOfView = `${focalToFieldOfView(focalLength)}deg`;
      if (focalInput) focalInput.value = String(focalLength);
      if (focalOutput) focalOutput.textContent = `${Math.round(focalLength)} mm`;
    };

    const activate = (button) => {
      [exteriorButton, interiorButton].forEach((item) => item?.classList.toggle("is-active", item === button));
    };

    const showExterior = () => {
      model.autoRotate = explorer.dataset.autoRotate === "true";
      model.cameraTarget = "auto auto auto";
      model.cameraOrbit = "45deg 65deg 90%";
      setFocalLength(35);
      model.jumpCameraToGoal();
      interiorMode = false;
      walkControls.hidden = true;
      activate(exteriorButton);
      if (activeExplorer === explorer) activeExplorer = null;
    };

    const showInterior = () => {
      const center = model.getBoundingBoxCenter();
      const size = model.getDimensions();
      const radius = Math.max(size.x, size.z) * 0.02;
      model.autoRotate = false;
      model.cameraTarget = `${center.x}m ${center.y - size.y * 0.1}m ${center.z}m`;
      model.cameraOrbit = `200deg 88deg ${radius}m`;
      setFocalLength(16);
      model.jumpCameraToGoal();
      interiorMode = true;
      walkControls.hidden = false;
      activeExplorer = explorer;
      activate(interiorButton);
    };

    const moveInside = (direction) => {
      if (!interiorMode) return;
      const target = model.getCameraTarget();
      const orbit = model.getCameraOrbit();
      const size = model.getDimensions();
      const step = Math.max(size.x, size.z) * 0.012;
      const forward = { x: -Math.sin(orbit.theta), z: -Math.cos(orbit.theta) };
      const right = { x: Math.cos(orbit.theta), z: -Math.sin(orbit.theta) };
      const vectors = {
        forward,
        back: { x: -forward.x, z: -forward.z },
        right,
        left: { x: -right.x, z: -right.z },
      };
      const vector = vectors[direction];
      model.cameraTarget = `${target.x + vector.x * step}m ${target.y}m ${target.z + vector.z * step}m`;
    };

    explorer.modelExplorer = { moveInside };
    exteriorButton?.addEventListener("click", showExterior);
    interiorButton?.addEventListener("click", showInterior);
    focalInput?.addEventListener("input", () => setFocalLength(focalInput.value));
    walkControls.querySelectorAll("[data-model-move]").forEach((button) => {
      button.addEventListener("click", () => moveInside(button.dataset.modelMove));
    });
    setFocalLength(focalInput?.value || 35);
  });

  window.addEventListener("keydown", (event) => {
    if (!activeExplorer || /input|textarea/i.test(document.activeElement.tagName)) return;
    const keyMap = { ArrowUp: "forward", w: "forward", ArrowDown: "back", s: "back", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
    const direction = keyMap[event.key];
    if (!direction) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activeExplorer.modelExplorer.moveInside(direction);
  }, true);
})();
