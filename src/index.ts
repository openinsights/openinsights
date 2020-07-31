/**
 * Open Insights is a library for building customized RUM clients.
 *
 * @remarks
 * This is the Open Insights core module. It defines business logic shared by
 * all RUM clients. An Open Insights "provider" specifies the logic particular
 * to a particular RUM service. Each of these is contained within its own
 * package. A "tag owner" builds a RUM client in their own package by importing
 * and utilizing features from the core module and one or more provider modules.
 *
 * @example
 * ```typescript
 * import { init, ClientSettingsBuilder } from 'open-insights'
 * import { Provider, ProviderSettings } from 'open-insights-provider-foo'
 *
 * const settingsBuilder = new ClientSettingsBuilder()
 * const fooSettings: ProviderSettings = {
 *   setting1: 'some value',
 *   setting2: 'some value,
 * }
 *
 * settingsBuilder.addProvider(new Provider(fooSettings))
 *
 * // Execute a RUM session
 * init(settingsBuilder.toSettings())
 *     .then(result => {
 *         // `result` contains the results from the RUM session after
 *         // completion
 *     })
 * ```
 *
 * @packageDocumentation
 */
import init from "./init"
import { ClientSettings } from "./@types"
import ClientSettingsBuilder from "./util/clientSettingsBuilder"
import Provider from "./lib/providerBase"
import { Test } from "./lib/test"
import Fetch from "./lib/fetch"

export { init, ClientSettings, ClientSettingsBuilder, Provider, Test, Fetch }
