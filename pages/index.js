import { ApolloConsumer, Query } from 'react-apollo';
import gql from 'graphql-tag';

const LOCAL_STATE = gql`
  {
    contentLanguage @client
  }
`;

const AUDIOS_QUERY = gql`
  query AUDIOS_QUERY($contentLanguage: [Language!]) {
    contentLanguage @client(always: true) @export(as: "contentLanguage")
    audios(where: { language_in: $contentLanguage }) {
      id
      title
      language
    }
  }
`;

const languages = ['ENGLISH', 'VIETNAMESE', 'CZECH', 'GERMAN'];

const onClick = async ({ target: { id } }, client, contentLanguage) => {
  contentLanguage.push(id);
  client.writeData({
    data: { contentLanguage },
  });
};

const Home = () => (
  <Query query={LOCAL_STATE}>
    {payload => {
      const contentLanguage = payload.data
        ? payload.data.contentLanguage
        : null;
      if (contentLanguage)
        return (
          <>
            <p>
              Languages currently in the Local State "contentLanguage" array:{' '}
              {contentLanguage.map(language => (
                <span key={language}>{language} </span>
              ))}
            </p>
            <ApolloConsumer>
              {client => (
                <Query query={AUDIOS_QUERY}>
                  {({ data, loading, error, variables }) => {
                    if (loading) return <div>loading...</div>;
                    if (error) return <div>error</div>;
                    return (
                      <div>
                        <p>
                          each button adds a corresponding language to the local
                          state variable "contentLanguage"
                        </p>
                        {languages.map(language => (
                          <button
                            type="button"
                            key={language}
                            id={language}
                            onClick={e =>
                              onClick(e, client, data.contentLanguage)
                            }
                          >
                            Load {language}
                          </button>
                        ))}
                        <p>Result of fetching:</p>
                        {data.audios.map(audio => (
                          <p key={audio.id}>
                            Item: Language: {audio.language} Title:{' '}
                            {audio.title}
                          </p>
                        ))}
                      </div>
                    );
                  }}
                </Query>
              )}
            </ApolloConsumer>
          </>
        );

      return <div>loading...</div>;
    }}
  </Query>
);

export default Home;
