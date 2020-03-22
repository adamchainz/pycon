/** @jsx jsx */
import { Box, Flex, Grid, Heading, Text } from "@theme-ui/components";
import { graphql } from "gatsby";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { jsx } from "theme-ui";

import { Article } from "../../components/article";
import { BlogPostIllustration } from "../../components/illustrations/blog-post";
import { MetaTags } from "../../components/meta-tags";
import { TalkQuery } from "../../generated/graphql";
import { compile } from "../../helpers/markdown";
import { BookWorkshop } from "./book-workshop";
import { SpeakerDetail } from "./speaker-detail";

type Props = {
  data: TalkQuery;
  pageContext: {
    socialCard: string;
    socialCardTwitter: string;
    slug: string;
  };
};

export default ({ data, ...props }: Props) => {
  const talk = data.backend.conference.talk!;
  const socialCard = `${data.site!.siteMetadata!.siteUrl}${
    props.pageContext.socialCard
  }`;
  const socialCardTwitter = `${data.site!.siteMetadata!.siteUrl}${
    props.pageContext.socialCardTwitter
  }`;

  const description = talk.submission
    ? talk.submission.abstract
    : talk.description;
  const elevatorPitch = talk.submission ? talk.submission.elevatorPitch : null;

  return (
    <Fragment>
      <MetaTags
        title={talk.title}
        imageUrl={socialCard}
        twitterImageUrl={socialCardTwitter}
      />

      <Grid
        sx={{
          mx: "auto",
          px: 3,
          py: 5,
          maxWidth: "container",
          gridColumnGap: 5,
          gridTemplateColumns: [null, null, "2fr 1fr"],
        }}
      >
        <Box>
          <Article title={talk.title}>
            {elevatorPitch && <Box>{compile(elevatorPitch).tree}</Box>}

            <Heading as="h2">Abstract</Heading>

            {compile(description).tree}
          </Article>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Flex
            sx={{
              position: "relative",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <BlogPostIllustration
              sx={{
                width: "80%",
              }}
            />

            <Box
              sx={{
                border: "primary",
                p: 4,
                backgroundColor: "cinderella",
                width: "80%",
                position: "absolute",
                left: 0,
                top: talk.imageFile ? "90%" : "70%",
              }}
            >
              <Text sx={{ fontWeight: "bold" }}>
                <FormattedMessage id="blog.author" />
              </Text>

              <Text>
                {talk.speakers.map(({ fullName }) => fullName).join(" & ")}
              </Text>
            </Box>
          </Flex>
          <BookWorkshop id={talk.id} slug={props.pageContext.slug} />
        </Box>
      </Grid>

      <Box sx={{ borderTop: "primary" }} />

      <Grid
        sx={{
          mx: "auto",
          px: 3,
          py: 5,
          maxWidth: "container",
          gridColumnGap: 5,
          gridTemplateColumns: [null, "1fr 2fr"],
        }}
      >
        {talk.speakers.map(speaker => (
          <SpeakerDetail speaker={speaker} key={speaker.fullName} />
        ))}
      </Grid>
    </Fragment>
  );
};

export const query = graphql`
  query Talk($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    backend {
      conference {
        talk(slug: $slug) {
          id
          title
          image
          highlightColor
          description

          submission {
            abstract
            elevatorPitch
          }

          speakers {
            fullName
          }

          imageFile {
            childImageSharp {
              fluid(maxWidth: 1600, grayscale: true) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;
