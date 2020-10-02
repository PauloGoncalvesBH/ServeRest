/* eslint no-template-curly-in-string: 0 */
const { env } = process

module.exports = {
  branches: [
    // https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#workflow-configuration
    { name: 'trunk', channel: 'latest' },
    { name: 'beta', channel: 'beta', prerelease: 'beta' }
  ],
  plugins: [
    ['@semantic-release/exec', { prepareCmd: `docker build -t ${env.DOCKER_USERNAME}/ServeRest .` }],
    ['semantic-release-docker', {
      name: `${env.DOCKER_USERNAME}/ServeRest`
    }]
  ]
}
