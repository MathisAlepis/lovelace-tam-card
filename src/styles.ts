import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  ha-card {
    --tam-surface: var(--tam-background, var(--ha-card-background, var(--card-background-color, #fff)));
    --tam-on-surface: var(--tam-text, var(--primary-text-color, #111));
    position: relative;
    overflow: hidden;
    container-type: inline-size;
    color: var(--tam-on-surface);
    background: var(--tam-surface);
    border: var(--ha-card-border-width, 1px) solid var(--tam-border, var(--ha-card-border-color, transparent));
    border-radius: var(--ha-card-border-radius, 12px);
    outline: none;
  }

  ha-card:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color, #03a9f4) 55%, transparent);
  }

  .layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--tam-gap, 14px);
    min-height: var(--tam-min-height, 64px);
    padding: var(--tam-padding, 10px 16px);
    box-sizing: border-box;
  }

  :host([compact]) .layout {
    --tam-gap: 10px;
    --tam-min-height: 52px;
    --tam-padding: 7px 12px;
  }

  .identity {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .mode-icon {
    --mdc-icon-size: 19px;
    flex: 0 0 auto;
    opacity: 0.86;
  }

  .line-badge {
    display: inline-grid;
    place-items: center;
    min-width: 30px;
    height: 30px;
    padding: 0 7px;
    box-sizing: border-box;
    border-radius: 7px;
    color: var(--tam-badge-text, var(--tam-on-surface));
    background: var(--tam-badge-background, color-mix(in srgb, var(--tam-on-surface) 14%, transparent));
    border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
    font-size: 0.95rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
  }

  .journey {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .stop,
  .destination {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stop {
    font-weight: 700;
  }

  .destination {
    font-weight: 500;
  }

  .arrow {
    flex: 0 0 auto;
    opacity: 0.7;
  }

  .departures {
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    min-width: max-content;
  }

  .departure {
    display: grid;
    align-content: center;
    justify-items: end;
    min-width: 68px;
    padding: 0 12px;
    font-variant-numeric: tabular-nums;
  }

  .departure:first-child {
    padding-left: 0;
  }

  .departure:last-child {
    padding-right: 0;
  }

  .departure + .departure {
    border-left: 2px solid color-mix(in srgb, currentColor 34%, transparent);
  }

  .time {
    font-size: 1rem;
    font-weight: 750;
    line-height: 1.15;
    white-space: nowrap;
  }

  .absolute {
    margin-top: 2px;
    font-size: 0.72rem;
    line-height: 1;
    opacity: 0.74;
  }

  .metadata {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    max-width: 100%;
    margin-top: -3px;
    padding: 0 8px 5px;
    box-sizing: border-box;
  }

  .metadata:empty {
    display: none;
  }

  .status-badge {
    overflow: hidden;
    max-width: 150px;
    padding: 2px 6px;
    border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--tam-surface) 78%, transparent);
    font-size: 0.62rem;
    font-weight: 650;
    line-height: 1.15;
    text-overflow: ellipsis;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }

  .approaching {
    --tam-border: var(--warning-color, #ff9800);
  }

  .approaching::after {
    position: absolute;
    z-index: 2;
    inset: 0;
    box-sizing: border-box;
    border: 3px solid var(--warning-color, #ff9800);
    border-radius: inherit;
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--warning-color, #ff9800) 38%, transparent);
    content: '';
    pointer-events: none;
    animation: tam-approaching-blink 1.2s steps(1, end) infinite;
  }

  .approaching-departure .time,
  .approaching-badge {
    animation: tam-approaching-label-blink 1.2s steps(1, end) infinite;
  }

  .approaching-badge {
    color: #111;
    background: var(--warning-color, #ff9800);
    border-color: var(--warning-color, #ff9800);
  }

  .approaching-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent);
    animation: tam-pulse 1.8s ease-out infinite;
  }

  .overview-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .overview-heading {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  .overview-summary {
    overflow: hidden;
    font-size: 0.72rem;
    opacity: 0.72;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .destination-list {
    margin: 0;
    padding: 0;
    border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    list-style: none;
  }

  .destination-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    min-height: 45px;
    padding: 7px 16px;
    box-sizing: border-box;
  }

  .destination-row + .destination-row {
    border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  }

  .destination-row.has-approaching {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
  }

  .destination-name {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 8px;
    font-weight: 650;
  }

  .destination-name > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .destination-times {
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    min-width: 0;
  }

  .destination-time {
    display: grid;
    align-content: center;
    justify-items: end;
    min-width: 64px;
    padding: 0 10px;
    font-variant-numeric: tabular-nums;
  }

  .destination-time:first-child {
    padding-left: 0;
  }

  .destination-time:last-child {
    padding-right: 0;
  }

  .destination-time + .destination-time {
    border-left: 1px solid color-mix(in srgb, currentColor 24%, transparent);
  }

  :host([compact]) .overview-header {
    padding: 8px 12px;
  }

  :host([compact]) .destination-row {
    min-height: 38px;
    padding: 5px 12px;
  }

  .message-layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    min-height: 64px;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  .message-layout ha-icon {
    --mdc-icon-size: 24px;
  }

  .message-title {
    font-weight: 700;
  }

  .message-detail {
    margin-top: 2px;
    font-size: 0.82rem;
    opacity: 0.78;
  }

  .retry {
    margin-top: 7px;
    padding: 5px 9px;
    color: inherit;
    background: color-mix(in srgb, currentColor 8%, transparent);
    border: 1px solid color-mix(in srgb, currentColor 32%, transparent);
    border-radius: 7px;
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .retry:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .skeleton {
    display: block;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(
      100deg,
      color-mix(in srgb, currentColor 8%, transparent) 25%,
      color-mix(in srgb, currentColor 18%, transparent) 40%,
      color-mix(in srgb, currentColor 8%, transparent) 55%
    );
    background-size: 220% 100%;
    animation: tam-loading 1.5s linear infinite;
  }

  .skeleton:first-child {
    width: min(210px, 65%);
  }

  .skeleton:last-child {
    width: min(145px, 45%);
    margin-top: 8px;
  }

  @container (max-width: 480px) {
    .layout {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 9px 12px;
    }

    .journey {
      align-items: center;
    }

    .departures {
      grid-column: 1 / -1;
      justify-self: stretch;
      justify-content: flex-end;
      min-width: 0;
      border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
      padding-top: 8px;
    }

    .departure {
      flex: 1 1 0;
      justify-items: center;
      min-width: 0;
      padding-inline: 6px;
    }

    .time {
      overflow: hidden;
      max-width: 100%;
      font-size: 0.88rem;
      text-overflow: ellipsis;
    }

    .overview-header,
    .destination-row {
      padding-inline: 12px;
    }

    .destination-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }

    .destination-name {
      font-size: 0.88rem;
    }

    .destination-times {
      justify-self: stretch;
    }

    .destination-time {
      flex: 1 1 0;
      justify-items: center;
      min-width: 0;
      padding-inline: 6px;
    }
  }

  @container (max-width: 330px) {
    .mode-icon {
      display: none;
    }

    .journey {
      display: grid;
      gap: 1px;
    }

    .arrow {
      display: none;
    }
  }

  @keyframes tam-pulse {
    70%,
    100% {
      box-shadow: 0 0 0 6px transparent;
    }
  }

  @keyframes tam-approaching-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.12;
    }
  }

  @keyframes tam-approaching-label-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.38;
    }
  }

  @keyframes tam-loading {
    to {
      background-position-x: -220%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .approaching::after,
    .approaching-departure .time,
    .approaching-badge,
    .approaching-dot,
    .skeleton {
      animation: none;
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 18px;
    padding: 4px 0 12px;
  }

  .section {
    display: grid;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
  }

  .section:last-child {
    border-bottom: 0;
  }

  h3 {
    margin: 0;
    color: var(--primary-text-color);
    font-size: 1rem;
    font-weight: 600;
  }

  .hint,
  .error {
    margin: 0;
    font-size: 0.84rem;
    line-height: 1.4;
  }

  .hint {
    color: var(--secondary-text-color);
  }

  .error {
    color: var(--error-color, #db4437);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  button {
    min-height: 36px;
    padding: 7px 12px;
    color: var(--primary-text-color);
    background: transparent;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
    border-radius: 8px;
    font: inherit;
    cursor: pointer;
  }

  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  ha-selector {
    display: block;
  }
`;
