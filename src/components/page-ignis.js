/**
 * @license
 *
 * Copyright (c) 2018, IBM.
 *
 * This source code is licensed under the Apache License, Version 2.0 found in
 * the LICENSE.txt file in the root directory of this source tree.
 */

import { LitElement, html, css } from 'lit-element';
import { localize } from '../pwa-helpers/i18next-localize-mixin.js';

import { i18next } from '../i18next.js';

import {
  SharedStyles,
  HeaderStyles,
  SectionStyles,
  SectionElementStyles,
  StackListStyles,
} from './app-shared-styles.js';
import { githubIcon } from './app-icons.js';
import './vaadin-ibmq-styles/vaadin-button.js';
import '@kuscamara/code-sample/code-sample.js';

import { trackClickEvent } from '../helpers/track-events.js';

class PageIgnis extends localize(i18next)(LitElement) {
  static get styles() {
    return [
      SharedStyles,
      HeaderStyles,
      SectionStyles,
      SectionElementStyles,
      StackListStyles,
      css`
        :host {
          --app-section-background-color: var(--qiskit-common-background-color);
          --app-section-color: #000000;
        }

        header {
          background-color: var(--qiskit-ignis-color);
        }

        section.colored .row .description .actions vaadin-button {
          --ibmq-button-secondary-color: #000000;
          --ibmq-button-secondary-focus-color: var(--qiskit-ignis-color);
        }

        .stack-list .element.dot::before {
          width: 0.682em;
          height: 0.682em;
          border-radius: 50%;
          left: -1.4em;
        }
      `,
    ];
  }

  render() {
    // prettier-ignore
    return html`
      <header>
        <img src="images/qiskit-ignis-logo.svg" .alt=${i18next.t('pages.ignis.altLogo')}>
        <div>
          <h1>
            ${i18next.t('pages.ignis.headerTitle')}
          </h1>
          <h2>${i18next.t('pages.ignis.headerSubTitle')}</h2>
          <div class="badges">
            <a
              href="https://github.com/Qiskit/qiskit-ignis"
              target="_blank"
              rel="noopener"
              @click=${() => trackClickEvent({
                action: 'Qiskit Ignis: GitHub Repository',
                objectType: 'Button'
              })}
            >
              <vaadin-button theme="secondary small">${githubIcon} GitHub</vaadin-button>
            </a>
          </div>
        </div>
      </header>

      <section class="colored">
        <div class="row limited-width">
          <div class="description">
            <h3>${i18next.t('pages.ignis.aboutTitle')}</h3>
            <p>
              ${i18next.t('pages.ignis.aboutDescription')}
            </p>
            <h3>${i18next.t('pages.ignis.stackTitle')}</h3>
            <div class="stack-list">
              <div class="element">
                <div class="title">Qiskit Ignis Experiments</div>
                <div class="subtitle">List of Quantum Circuits or Pulse Schedules</div>
              </div>
              <div class="element">
                <div class="title">Qiskit Terra</div>
                <div class="subtitle">Compile Circuits or Schedules</div>
              </div>
              <div class="element">
                <div class="title">Providers</div>
                <div class="subtitle">Qiskit Aer, IBM Q, Third Party</div>
              </div>
              <div class="element dot">
                <div class="title">Fitter/Filter</div>
                <div class="subtitle">Fit to a Model/Plot Results</div>
              </div>
            </div>
          </div>
          <div class="illustration">
            <h3>${i18next.t('pages.ignis.exampleTitle')}</h3>
            <code-sample
              type="python"
              copy-clipboard-button
              @click=${() => trackClickEvent({
                action: 'Qiskit Ignis: Copy Code Sample',
                objectType: 'Button'
              })}
            >
              <!-- htmlmin:ignore -->
              <template>
                import qiskit
                from qiskit.providers.aer.noise import NoiseModel
                from qiskit.providers.aer.noise.errors.standard_errors import depolarizing_error

                # Import the RB Functions
                from qiskit.ignis.verification.randomized_benchmarking import randomized_benchmarking_seq, RBFitter

                # Generate RB circuits (2Q RB)
                rb_opts = {}
                rb_opts['length_vector'] = [1, 10, 20, 50, 75, 100, 125]
                rb_opts['nseeds'] = 5
                rb_opts['rb_pattern'] = [[0, 1]]
                rb_circs, xdata = randomized_benchmarking_seq(**rb_opts)

                # Run on a noisy simulator
                noise_model = NoiseModel()
                noise_model.add_all_qubit_quantum_error(depolarizing_error(0.002, 1), ['u1', 'u2', 'u3'])
                noise_model.add_all_qubit_quantum_error(depolarizing_error(0.002, 2), 'cx')

                backend = qiskit.Aer.get_backend('qasm_simulator')

                # Create the RB fitter
                rb_fit = RBFitter(None, xdata, rb_opts['rb_pattern'])
                for rb_seed,rb_circ_seed in enumerate(rb_circs):

                    job = qiskit.execute(rb_circ_seed, backend=backend,
                         basis_gates=['u1','u2','u3','cx'],
                         noise_model=noise_model)

                    # Add data to the fitter
                    rb_fit.add_data(job.result())
                    print('After seed %d, EPC %f'%(rb_seed,rb_fit.fit[0]['epc']))
              </template>
              <!-- htmlmin:ignore -->
            </code-sample>
          </div>
        </div>
      </section>
    `;
  }
}

window.customElements.define('page-ignis', PageIgnis);
