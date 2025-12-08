import Container from "../Container";
import { CardSkeleton } from "../ProductDirection/ProductDirection";
import SkeletonOne from "./Skeletons/first";

const FeaturesSecondary = () => {
    return <Container className="mt-36 md:pt-4 ">
        <div className="mx-auto grid grid-cols-1 mt-10 md:grid-cols-2 border-y border-neutral-500 dark:border-neutral-700 divide-x divide-neutral-200 dark:divide-neutral-700">
                    <div className="p-4 mx-16">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300">Manage incoming work with Triage</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance">Review and assign incoming bug reports, feature requests, and other unplanned work.</p>
                        <CardSkeleton>
                            <SkeletonOne>
                            </SkeletonOne>
                        </CardSkeleton>
                    </div>
                    <div className="p-4 mx-auto">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300">Project updates</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance">Communicate progress and project health with built-in project updates.</p>
                         <CardSkeleton>
                        </CardSkeleton>
                    </div>
                </div>
    </Container>
}
export default FeaturesSecondary;