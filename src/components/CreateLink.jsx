import React, { Component } from 'react';
import { LINKS_PER_PAGE } from '../constants';
import { FEED_QUERY } from "./LinkList";
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
const POST_MUTATION = gql`
mutation PostMutation($description: String!, $url: String!) {
  post(description: $description, url: $url) {
    id
    createdAt
    url
    description
  }
}
`

class CreateLink extends Component {
    state = {
        description: '',
        url: '',
    }

    render() {
        const { description, url } = this.state;
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        type="text"
                        className="mb2"
                        value={description}
                        onChange={e => this.setState({ description: e.target.value })}
                        placeholder="A description for the link"
                    />
                    <input
                        type="text"
                        className="mb2"
                        value={url}
                        onChange={e => this.setState({ url: e.target.value })}
                        placeholder="The URL for the link"
                    />
                </div>
                <Mutation
                    mutation={POST_MUTATION}
                    variables={{ description, url }}
                    onCompleted={() => this.props.history.push('/new/1')}
                    update={(store, { data: { post } }) => {
                        const first = LINKS_PER_PAGE
                        const skip = 0
                        const orderBy = 'createdAt_DESC'
                        const data = store.readQuery({
                            query: FEED_QUERY,
                            variables: { first, skip, orderBy }
                        })
                        data.feed.links.unshift(post)
                        store.writeQuery({
                            query: FEED_QUERY,
                            data,
                            variables: { first, skip, orderBy }
                        })
                    }}
                >
                    {postMutation => <button onClick={postMutation}>Submit</button>}
                </Mutation>
            </div>
        )
    }
}

export default CreateLink;